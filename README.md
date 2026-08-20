# n8n automation, hosted for $0

A tested, self-hosted n8n setup that costs nothing to run: Docker Compose stack,
free HTTPS, sample automations, backups and a one-command installer for a
free-forever cloud VM.

**Short answer to "which platform is free?"** — [Oracle Cloud's Always Free
tier](docs/free-hosting-options.md). It is the only mainstream cloud that gives
you a VM which stays on 24/7 forever: an Ampere ARM instance with up to 4 CPUs, 24 GB
RAM and 200 GB of disk, with no trial clock. n8n's Community Edition is free
software with no execution limits, HTTPS is free via Let's Encrypt or Cloudflare
Tunnel, and a hostname can be free too. Total: **$0/month**, versus roughly
$25/month for n8n Cloud's entry plan.

Everything here has been run end to end against n8n 2.35.5, not just written
down: see [Verified](#verified).

## What you get

| | |
|---|---|
| `docker-compose.yml` | n8n + Postgres 17, plus optional Caddy (HTTPS) or Cloudflare Tunnel |
| `docker-compose.sqlite.yml` | slimmer SQLite-only stack for 1 GB machines (~317 MB RAM) |
| `scripts/bootstrap.sh` | installs Docker, adds swap, opens ports, generates secrets |
| `scripts/smoke-test.sh` | boots the stack, imports workflows, fires a real webhook, asserts the response |
| `scripts/backup.sh` / `restore.sh` | Postgres dump + workflow/credential export, with retention |
| `scripts/preflight.sh` | catches the `WEBHOOK_URL` and proxy mistakes that silently kill triggers |
| `workflows/` | three working automations: webhook API, scheduled digest, uptime monitor |

## Quickstart on your own machine

Requires Docker and Docker Compose.

```bash
git clone <this-repo> && cd <this-repo>
make up          # generates .env with fresh secrets, then starts n8n
make health      # confirms it is serving
make import      # loads the three sample workflows
```

Open <http://localhost:5678>, create the owner account (local only, no signup),
and you have a working automation server. `make smoke` runs the full end-to-end
test if you want proof before touching a server.

## Deploy it free, for real

1. Create an **Oracle Cloud Always Free** VM (`VM.Standard.A1.Flex`, Ubuntu 24.04,
   1–4 OCPU, 6–24 GB). Full click-by-click walkthrough:
   [docs/oracle-cloud-free-tier.md](docs/oracle-cloud-free-tier.md).
2. On the VM:

   ```bash
   git clone <this-repo> n8n && cd n8n
   ./scripts/bootstrap.sh      # Docker, swap, firewall, secrets
   ```

3. Get a free hostname and HTTPS — your own domain, a free DuckDNS subdomain,
   `sslip.io` magic DNS, or a Cloudflare Tunnel that needs no open ports at all:
   [docs/https-and-webhooks.md](docs/https-and-webhooks.md).
4. Edit `.env` with that hostname, then:

   ```bash
   make up-caddy       # Let's Encrypt certificate, ports 80/443
   # or
   make up-tunnel      # Cloudflare Tunnel, zero inbound ports
   make health && make import
   ```

Both commands run `scripts/preflight.sh` first, which refuses to expose an
instance whose `WEBHOOK_URL`, proxy-hop or cookie settings would leave triggers
broken or the editor unencrypted.

## The sample automations

| Workflow | Pattern it teaches |
|---|---|
| `01-hello-webhook.json` | Webhook in, transform, respond. This is what you point Typeform, Stripe, GitHub or a chatbot at. |
| `02-daily-weather-digest.json` | Schedule, call a free API, format, push to Slack/Discord/Google Chat. |
| `03-uptime-monitor.json` | Poll a list of URLs every 15 minutes, branch on the status code, alert. Replaces a paid uptime monitor. |

None of them need a paid service or an API key. Details and how to adapt them:
[docs/workflows.md](docs/workflows.md).

## Day-to-day

```bash
make logs           # follow n8n logs
make backup         # dump + export into ./backups (keeps the last 7)
make update         # back up, pull the pinned image, recreate
make health         # cron-friendly: exits non-zero when unhealthy
make validate       # lint compose files, workflow JSON and scripts offline
make LITE=1 up      # same commands against the 1 GB SQLite stack
```

Backups, cron entries, resource tuning and upgrade practice:
[docs/operations.md](docs/operations.md). When something breaks:
[docs/troubleshooting.md](docs/troubleshooting.md).

## Is this really free, and legal?

- **The software.** n8n Community Edition is fair-code under the Sustainable Use
  License: free to use for internal business and personal purposes, with no cap
  on workflows or executions. What you may not do is resell n8n itself as a
  hosted service. Self-hosting your own automations is exactly the intended use.
- **The hosting.** Oracle's Always Free resources have no expiry date. A credit
  card is used for identity verification only. The practical catches are that
  Ampere capacity is often unavailable in busy regions, and that Oracle may
  reclaim an *idle* Always Free instance — both covered in
  [docs/free-hosting-options.md](docs/free-hosting-options.md).
- **What could cost money.** A domain, if you insist on a custom one (free
  alternatives are documented), and any paid API a workflow of yours calls.

## Verified

Run against n8n 2.35.5 with Docker 29.1.3 on Ubuntu 24.04:

- `scripts/smoke-test.sh` passes on both stacks: n8n boots, all three workflows
  import, the webhook workflow activates and answers a real `POST` with the
  transformed payload, and unknown webhook paths return 404.
- Workflow 02 and 03 were executed node by node against a local stub server:
  the digest formats correctly, and the uptime monitor's `IF` node routes a 503
  to the alert branch and a 200 to the all-clear branch, with the paired-item
  lookup resolving the right target.
- `backup.sh` produced a 68 KB Postgres dump plus a per-workflow export;
  `restore.sh` recovered all five workflows after the `workflow_entity` table was
  deliberately emptied, and the live webhook still answered afterwards.
- Idle memory: 359 MB (n8n) + 25 MB (Postgres), or 317 MB for the SQLite stack —
  comfortable inside a 1 GB free instance, luxurious on a 24 GB Ampere one.

## Layout

```
docker-compose.yml          full stack (Postgres, optional Caddy/Cloudflare Tunnel)
docker-compose.sqlite.yml   1 GB stack (SQLite)
caddy/Caddyfile             HTTPS reverse proxy config
.env.example                every setting, with the reasoning inline
Makefile                    make help lists everything
scripts/                    bootstrap, preflight, import/export, backup/restore, tests
workflows/                  importable sample automations
docs/                       hosting comparison, Oracle guide, HTTPS, ops, troubleshooting
```
