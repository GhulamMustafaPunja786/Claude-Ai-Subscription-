# Host n8n for $0/month — Oracle Cloud "Always Free" Tier

This folder contains everything needed to run your own **n8n** automation
server that costs **nothing, forever** — no trial period, no credit-card
surprise charges, no monthly cap on workflows or executions.

## Why Oracle Cloud, and not Railway / Render / n8n Cloud?

| Option | Truly free forever? | Notes |
| --- | --- | --- |
| **Oracle Cloud "Always Free" (this guide)** | ✅ Yes | Up to 4 ARM OCPUs + 24 GB RAM, no expiry. Card required for identity verification only, never charged unless you explicitly upgrade. |
| Google Cloud `e2-micro` | ✅ Yes, but tiny | Only 1 shared vCPU / 1 GB RAM — workable but sluggish for busy workflows. |
| Railway / Render free tier | ❌ No | Free credit runs out or the app sleeps after inactivity, breaking webhooks. |
| n8n Cloud | ❌ No | Paid SaaS plans only (~$24+/month), plus workflow/execution caps. |
| AWS Free Tier / Azure free VM | ❌ No | Expires after 12 months, then billed. |

**Recommendation:** use Oracle Cloud's Always Free Ampere A1 VM. It's the
only option that is both fully free forever and powerful enough to run n8n
comfortably 24/7.

> Oracle's free ARM capacity is sometimes temporarily unavailable in popular
> regions when you first try to create the instance. If that happens, try a
> different Availability Domain, try again later, or fall back to the
> Google Cloud `e2-micro` VM (still $0/month) using the same steps below.

## What's in this folder

```
n8n-free-hosting/
├── docker-compose.yml     # n8n + Caddy (automatic free HTTPS) stack
├── Caddyfile              # reverse proxy config, reads N8N_HOST from .env
├── .env.example           # copy to .env and fill in your values
├── scripts/
│   ├── setup-vm.sh        # one-time VM bootstrap: installs Docker + firewall
│   └── backup.sh          # exports workflows/credentials, for cron
└── workflows/
    └── hello-world-webhook.json   # sample workflow to confirm everything works
```

## Step 1 — Create the free VM

1. Sign up at [cloud.oracle.com](https://www.oracle.com/cloud/free/) (a card
   is required for identity verification only — it will not be charged).
2. Create a **Compute Instance**:
   - Shape: `VM.Standard.A1.Flex` (Ampere ARM), 2 OCPUs / 12 GB RAM is plenty
     for personal use and stays inside the Always Free allowance (4 OCPUs /
     24 GB total).
   - Image: Ubuntu 22.04 or 24.04 (ARM/aarch64 build).
   - Enable **"Assign a public IPv4 address"**.
   - Add your SSH public key.
3. Open the network ports. In the VM's subnet **Security List** (or an
   attached **Network Security Group**), add ingress rules for:
   - TCP 22 (SSH)
   - TCP 80 (HTTP, used for the Let's Encrypt certificate challenge)
   - TCP 443 (HTTPS)

   This is a common gotcha: even with the OS firewall configured, Oracle
   blocks traffic at the VCN level until you add these rules in the console.

## Step 2 — Point a domain at the VM

You need a hostname (not just an IP) so Caddy can issue a free TLS
certificate automatically. Any of these work at no cost:

- A subdomain of a domain you already own (add an `A` record → VM's public
  IP).
- A free dynamic-DNS subdomain, e.g. from [DuckDNS](https://www.duckdns.org/)
  or [Cloudflare](https://www.cloudflare.com/) (if you transfer/park a free
  domain there).

## Step 3 — Bootstrap the VM

```bash
scp -r n8n-free-hosting ubuntu@<vm-public-ip>:~/
ssh ubuntu@<vm-public-ip>
cd n8n-free-hosting
chmod +x scripts/*.sh
./scripts/setup-vm.sh
```

This installs Docker + the Compose plugin and opens ports 80/443/22 in the
OS firewall (`ufw`). Log out and back in afterwards so your user can run
`docker` without `sudo`.

## Step 4 — Configure and start n8n

```bash
cp .env.example .env
nano .env   # set N8N_HOST to your domain, and generate N8N_ENCRYPTION_KEY:
            #   openssl rand -hex 32

docker compose up -d
docker compose logs -f   # watch until Caddy reports the certificate was issued
```

Visit `https://<your-domain>` and create the n8n **owner account** (this
replaces the older `N8N_BASIC_AUTH_*` variables, which are deprecated).

## Step 5 — Import the test workflow

In the n8n editor: **Workflows → Import from File** → select
`workflows/hello-world-webhook.json`, then activate it. Test it with:

```bash
curl https://<your-domain>/webhook/hello-world
```

You should get back a JSON response confirming the webhook was received.
From here, build/import whatever automation you need (Typeform, WhatsApp,
Slack, Google Sheets, etc.) — n8n ships with 400+ integration nodes and
unlimited workflows/executions on a self-hosted instance.

## Step 6 — Keep it free and reliable

- **Back up regularly.** Run `./scripts/backup.sh` manually or via cron
  (see the comment header in that script) and copy the resulting
  `backups/*.tar.gz` file off the VM (private GitHub repo, Google Drive,
  etc.). This also protects you if you ever lose `N8N_ENCRYPTION_KEY`.
- **Don't create paid resources.** When adding block storage, backups, load
  balancers, etc. in the Oracle console, always double-check the box is
  labeled "Always Free eligible" before confirming.
- **Update periodically:**
  ```bash
  docker compose pull
  docker compose up -d
  ```
- **Monitor disk usage** — the Always Free boot volume is capped; the
  `EXECUTIONS_DATA_PRUNE`/`EXECUTIONS_DATA_MAX_AGE` settings in
  `docker-compose.yml` already auto-delete execution logs older than 14
  days to keep it from filling up.

## Alternative: Google Cloud `e2-micro` (also $0/month forever)

The exact same `docker-compose.yml` / `Caddyfile` work unchanged on a GCP
free-tier `e2-micro` VM (`us-west1`, `us-central1`, or `us-east1`, Always
Free eligible). Create the VM with HTTP/HTTPS traffic allowed, run
`scripts/setup-vm.sh`, then continue from Step 4. Expect it to feel slower
under heavy load since it only has 1 shared vCPU / 1 GB RAM — fine for a
handful of workflows, not for high-volume AI/data-heavy automations.

## Notes on this repository

- This is Ghulam Mustafa Punja's personal automations repo, unrelated to
  the previously discussed WhatsApp/Typeform Vercel project. Per that
  project's constraint, nothing here is deployed to (or intended for) the
  personal Vercel Hobby account — this setup targets a self-hosted VM
  instead, which also happens to be the only genuinely free way to run a
  long-lived n8n process (n8n needs a persistent server/database, which
  doesn't fit Vercel's serverless model well regardless).
