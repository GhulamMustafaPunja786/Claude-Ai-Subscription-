# Running it day to day

## Backups

`scripts/backup.sh` writes a timestamped directory under `backups/` containing:

- `postgres.sql.gz` — full database dump: workflows, credentials, executions,
  users, settings (skipped on the SQLite stack)
- `workflows/*.json` — one file per workflow, readable and diffable
- `credentials/*.json` — encrypted credential export
- `MANIFEST.txt` — timestamp, n8n version, and a fingerprint of the encryption
  key so a restore can warn you about a key mismatch

```bash
make backup
BACKUP_KEEP=14 ./scripts/backup.sh     # keep more history
```

Two rules that decide whether a backup is actually a backup:

1. **Store `N8N_ENCRYPTION_KEY` separately.** Credentials in the dump are
   encrypted with it. A database restored without the matching key gives you
   every workflow and not one working credential. `grep N8N_ENCRYPTION_KEY .env`
   and keep the value in a password manager.
2. **Copy `backups/` off the machine.** On the same disk it only protects you
   from mistakes, not from losing the instance. `rclone` to any free cloud drive,
   or pull it with `scp`/`rsync` from a machine you control.

Nightly, keeping the last 7:

```bash
(crontab -l 2>/dev/null; echo "15 3 * * * cd $PWD && ./scripts/backup.sh >> /var/log/n8n-backup.log 2>&1") | crontab -
```

Restoring:

```bash
ls backups/
make restore DIR=backups/2026-08-20T03-15-00Z
```

With a Postgres dump present, this stops n8n, replays the dump and starts n8n
again. Without one it imports the JSON exports instead. Practise it once while
nothing is at stake.

## Updating

```bash
nano .env          # bump N8N_IMAGE_TAG to a release from github.com/n8n-io/n8n/releases
make update        # backs up, pulls, recreates, waits for health, prunes old layers
```

The tag is pinned on purpose. With `:latest`, an unrelated `docker compose pull`
can move you across a major version — and n8n's database migrations are one-way,
so rolling back means restoring the backup taken minutes earlier.

Read the release notes before a major bump. Breaking changes usually concern node
type versions, and a workflow saved on a newer node version does not load on an
older n8n.

## Keeping a small box healthy

Execution history is what fills a free tier disk. The compose files prune by
default: 168 hours of history and at most 10 000 executions on the Postgres
stack, 72 hours and 2 000 on the SQLite one. For a chatty workflow, stop storing
successful runs:

```bash
EXECUTIONS_DATA_SAVE_ON_SUCCESS=none
```

Failures are still recorded, which is what you actually debug.

Other levers:

```bash
make stats                 # live CPU and memory per container
docker system df           # what the images, volumes and cache are costing you
docker system prune -f     # reclaim dangling images and build cache
```

On a 1 GB instance, use `docker-compose.sqlite.yml` (`make LITE=1 up`), keep the
2 GB swapfile `bootstrap.sh` creates, and leave `NODE_MAX_OLD_SPACE_MB=512` alone
unless you see heap errors. Measured idle usage: 317 MB for the SQLite stack,
385 MB for n8n plus Postgres.

## Security basics

- The compose files publish n8n on `127.0.0.1` only. The proxy or tunnel is the
  only thing facing the internet. Setting `N8N_BIND_ADDRESS=0.0.0.0` puts an
  unencrypted editor on your public IP — `preflight.sh` will argue with you.
- Create the owner account the moment the instance is reachable. Whoever loads a
  fresh instance first becomes its owner.
- `N8N_BLOCK_ENV_ACCESS_IN_NODE=true` (default here) stops Code nodes reading
  `$env`, so a workflow cannot exfiltrate your database password.
- `.env` is `chmod 600` and git-ignored. Keep it that way.
- Keep the image current. n8n ships security fixes in ordinary releases.
- Do not put a login form in front of the whole domain if you use webhooks:
  external callers cannot authenticate. Protect the editor, not `/webhook/*`.

## Moving between stacks or servers

Because credentials are encrypted with `N8N_ENCRYPTION_KEY`, moving is:

1. `make backup` on the old box.
2. Copy `backups/<timestamp>/` and the `N8N_ENCRYPTION_KEY` value across.
3. On the new box, `./scripts/bootstrap.sh`, then paste the *same* encryption key
   into `.env`.
4. `make up && make restore DIR=backups/<timestamp>`.

The same procedure moves you from SQLite to Postgres: restore the JSON exports
into the Postgres stack, since a SQLite backup contains no `postgres.sql.gz`.
