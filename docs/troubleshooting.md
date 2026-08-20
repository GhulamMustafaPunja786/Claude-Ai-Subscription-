# Troubleshooting

Start here:

```bash
make health          # containers, /healthz, public URL, memory, disk
make logs            # follow n8n's own logs
make validate        # offline: compose files, workflow JSON, scripts
```

## Webhook URLs show `:5678`, or `localhost`

`WEBHOOK_URL` is unset or wrong. It must be the exact public base with a trailing
slash:

```bash
WEBHOOK_URL=https://n8n.example.com/
make restart
```

Then reopen a Webhook node and confirm the production URL has no port in it.

## An external service calls the webhook and nothing happens

Work down this list:

1. **Is the workflow active?** `/webhook/<path>` only answers for active
   workflows. `/webhook-test/<path>` only answers while the editor is listening.
   A 404 on the production path is almost always this.
2. **Did activation happen outside the editor?** Activation via
   `n8n update:workflow` needs a restart before the path registers —
   `scripts/activate-workflow.sh` restarts for you.
3. **Does the path reach n8n at all?**
   `curl -i https://your.domain/webhook/hello` from somewhere else. A timeout is
   firewall or DNS; a 502 is the proxy not reaching the container; a 404 is n8n
   answering, so the problem is inside n8n.
4. **Two firewalls, on Oracle.** The VCN security list *and* the OS `iptables`
   chain both have to allow 80/443.
5. **Method mismatch.** A node set to `POST` returns 404 for a `GET`.

## `n8n did not become healthy` / database connection timeouts

```
Initial database connection attempt 1 failed: Could not establish database
connection within the configured timeout of 20,000 ms
```

Postgres is up but unreachable from the n8n container. Confirm which:

```bash
docker compose ps                     # is postgres healthy?
docker compose exec -T postgres psql -U n8n -d n8n -c 'select 1;'
```

If Postgres answers locally but n8n cannot connect, something is dropping
traffic between containers. The usual cause is a host firewall with a `FORWARD`
policy of `DROP`, which is exactly how Oracle's stock images and hardened hosts
are configured:

```bash
sudo iptables -L FORWARD -n | head -3       # look for "policy DROP"
sudo iptables-legacy -L FORWARD -n | head -3   # both tables can exist
```

Docker's own rules live in `DOCKER-USER` and `DOCKER-FORWARD`. Add your rules to
`DOCKER-USER` rather than editing Docker's chains, and remember the policy DROP
applies to bridged container traffic when `br_netfilter` is loaded.

Also check `POSTGRES_PASSWORD` is identical for both services — it comes from one
`.env` value, so a hand-edited compose file is usually to blame.

## Postgres compatibility warning

```
Postgres 16 is outside the supported range and receives compatibility support only.
```

n8n 2.x wants Postgres 17 or newer. `docker-compose.yml` already pins
`postgres:17-alpine`. If you started on 16, dump before switching — a Postgres
major upgrade cannot read the old data directory:

```bash
make backup                    # produces postgres.sql.gz
docker compose down
docker volume rm n8n-free_postgres_data
# set the image to postgres:17-alpine, then
make up
make restore DIR=backups/<timestamp>
```

## Login loops back to the login page

`N8N_SECURE_COOKIE=true` while you are browsing over plain HTTP. The browser
refuses to send the cookie back. Either finish the HTTPS setup or set it to
`false` for local access.

## 502 from Caddy

n8n is not reachable at `n8n:5678`. Check `docker compose ps` and
`docker compose logs n8n`. On SELinux systems (Oracle Linux, RHEL), a proxy
running outside Docker also needs:

```bash
sudo setsebool -P httpd_can_network_connect 1
```

The Caddy profile here runs inside Docker on the same network, which avoids that
class of problem entirely.

## Certificate never issues

Let's Encrypt's HTTP-01 challenge needs port 80 reachable from the internet and
DNS already pointing at the machine.

```bash
./scripts/preflight.sh caddy      # checks DNS against the public IP, and ports
docker compose logs caddy
```

If DNS resolves to a Cloudflare IP because the orange cloud is on, either turn
proxying off until the certificate issues, or use the Cloudflare Tunnel option
instead and let Cloudflare handle TLS.

## Credentials broken after a restore

The instance is running with a different `N8N_ENCRYPTION_KEY` than the one that
encrypted them. Put the original key back in `.env` and restart; there is no way
to recover them without it. `scripts/backup.sh` records a fingerprint of the key
in `MANIFEST.txt` and `restore.sh` warns on a mismatch before you get this far.

## `Task Broker's port 5679 is already in use`

You ran an `n8n` CLI command inside a container that is already serving. Give the
CLI its own broker port:

```bash
docker compose exec -T -e N8N_RUNNERS_BROKER_PORT=5689 n8n n8n execute --id <id>
```

Note that `n8n execute` can only start workflows with an Execute Workflow
Trigger; a schedule- or webhook-triggered workflow has to be run from the editor
or by its trigger.

## Container killed, or the whole box goes unresponsive

Out of memory. Confirm with `dmesg | grep -i oom` and `make stats`. On a 1 GB
instance: switch to `make LITE=1 up`, make sure the swapfile exists
(`swapon --show`), lower `NODE_MAX_OLD_SPACE_MB`, and set
`EXECUTIONS_DATA_SAVE_ON_SUCCESS=none`.

## The Oracle instance disappeared

Always Free instances that look idle for 7 days can be reclaimed. Keep real work
scheduled on it, or move the tenancy to Pay As You Go while staying inside the
Always Free limits. See
[free-hosting-options.md](free-hosting-options.md#the-two-real-catches).
