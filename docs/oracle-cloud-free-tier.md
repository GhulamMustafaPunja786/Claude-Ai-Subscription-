# Deploying on Oracle Cloud Always Free

Start to finish this is about an hour, most of it waiting on account
verification and DNS. Nothing here leaves the Always Free allowance.

## 1. Create the account

1. Sign up at <https://www.oracle.com/cloud/free/>.
2. Choose your **home region** carefully — it cannot be changed afterwards, and
   it decides whether you can ever get an Ampere instance. Busy regions
   (Frankfurt, London, Ashburn, Mumbai) are the hardest. A quieter region in the
   same continent is a better bet.
3. A credit card is required for identity verification. Always Free resources do
   not charge it. Verification takes anywhere from minutes to a day.

## 2. Create the VM

Compute → Instances → **Create instance**.

| Setting | Value |
|---|---|
| Image | Canonical Ubuntu 24.04 |
| Shape | `VM.Standard.A1.Flex` (Ampere, ARM) |
| OCPUs / memory | 1 OCPU / 6 GB is plenty and much easier to get than 4 / 24 |
| Boot volume | 50 GB (the free allowance is 200 GB total) |
| SSH keys | Paste your public key, or let Oracle generate one and download it |
| Networking | Assign a public IPv4 address |

Everything you pick must show the **Always Free eligible** badge.

If you get `Out of host capacity`, that is Ampere contention rather than a
mistake on your side. Ask for fewer OCPUs, try a different availability domain,
retry over the next days, or start on the AMD micro shape (`VM.Standard.E2.1.Micro`,
1 GB) with `docker-compose.sqlite.yml`.

## 3. Open the ports (there are two firewalls)

This is the step that trips almost everyone: Oracle filters traffic **twice**.

**Cloud side** — Networking → Virtual Cloud Networks → your VCN → the public
subnet → its Security List → Add Ingress Rules:

| Source | Protocol | Destination port |
|---|---|---|
| `0.0.0.0/0` | TCP | 80 |
| `0.0.0.0/0` | TCP | 443 |

**OS side** — Oracle's images ship an `iptables` INPUT chain whose last rule
rejects everything, so appending a rule does nothing; it has to be inserted
above the reject. `scripts/bootstrap.sh` handles this, including persisting the
rules across reboots.

Using Cloudflare Tunnel instead? Skip both: the tunnel dials out, so no inbound
port needs to be open at all.

## 4. Install

```bash
ssh -i /path/to/key ubuntu@<public-ip>
git clone <this-repo> n8n && cd n8n
./scripts/bootstrap.sh
exec newgrp docker      # picks up docker group membership without logging out
```

`bootstrap.sh` installs Docker and Compose, adds a 2 GB swapfile if the box has
under 2 GB of RAM, opens the OS firewall, and writes `.env` with freshly
generated secrets.

## 5. Point a hostname at it and go live

Create a DNS `A` record for your hostname pointing at the instance's public IP
(or use a free option from [https-and-webhooks.md](https-and-webhooks.md)), then:

```bash
nano .env
# N8N_HOST=n8n.yourdomain.com
# N8N_PROTOCOL=https
# WEBHOOK_URL=https://n8n.yourdomain.com/
# N8N_PROXY_HOPS=1
# N8N_SECURE_COOKIE=true
# LETSENCRYPT_EMAIL=you@example.com

make up-caddy
make health
make import
```

Open `https://n8n.yourdomain.com`, create the owner account immediately — the
first person to reach a fresh instance becomes the owner — and start building.

## 6. Make it survive you not watching

```bash
# nightly backup, keeps the last 7
(crontab -l 2>/dev/null; echo "15 3 * * * cd $PWD && ./scripts/backup.sh >> /var/log/n8n-backup.log 2>&1") | crontab -

# restart n8n if it stops answering
(crontab -l 2>/dev/null; echo "*/10 * * * * cd $PWD && ./scripts/health-check.sh --quiet || make restart") | crontab -
```

Containers already carry `restart: unless-stopped`, so they come back after a
reboot on their own.

Two Oracle-specific things worth knowing:

- **Idle reclamation.** Oracle can reclaim an Always Free instance that has
  looked idle for 7 days. Keeping `03-uptime-monitor.json` active is enough
  activity to avoid it. See
  [free-hosting-options.md](free-hosting-options.md#the-two-real-catches).
- **Boot volume backups.** Oracle's own backups are not part of the free
  allowance, which is why `scripts/backup.sh` exists. Copy `backups/` off the
  box — `rclone` to a free cloud drive, or `scp` on a schedule from a machine you
  control — and store `N8N_ENCRYPTION_KEY` somewhere separate from the dumps.
