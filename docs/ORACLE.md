# Oracle Cloud Always Free (24/7, $0 after card verification)

Oracle's Always Free Ampere ARM VM (up to 4 OCPU / 24 GB) is the most reliable **permanently free** place to run n8n around the clock. A card is required to verify identity; stay inside Always Free shapes and you are not billed.

Hugging Face is easier if you do not want a Linux VM. Use Oracle when webhooks and schedules must never sleep.

## 1. Create the VM

1. Sign up at [oracle.com/cloud/free](https://www.oracle.com/cloud/free/).
2. Create a compute instance:
   - Image: Ubuntu 22.04 or 24.04
   - Shape: **VM.Standard.A1.Flex** (Always Free eligible)
   - 1–2 OCPU and 6–12 GB RAM is enough for n8n
3. Open **VCN security list** ingress for TCP 22, 80, 443.
4. SSH in with your private key.

## 2. Install Docker

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2 git
sudo usermod -aG docker "$USER"
# log out and back in
```

## 3. Point a domain

Create an A record from `n8n.yourdomain.com` to the VM public IP. Caddy in `docker-compose.postgres.yml` requests a Let's Encrypt certificate automatically.

## 4. Launch n8n

```bash
git clone https://github.com/GhulamMustafaPunja786/Claude-Ai-Subscription-.git
cd Claude-Ai-Subscription-
cp .env.example .env
nano .env
```

Set at least:

```
N8N_ENCRYPTION_KEY=<openssl rand -hex 32>
N8N_HOST=n8n.yourdomain.com
POSTGRES_PASSWORD=<strong password>
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_NOTIFY_TO=92xxxxxxxxxx
```

```bash
docker compose -f docker-compose.postgres.yml up -d
```

Open `https://n8n.yourdomain.com`, create the owner account, import the JSON files under `workflows/`.

## Firewall inside the guest

If Ubuntu's UFW is enabled:

```bash
sudo ufw allow 22,80,443/tcp
sudo ufw enable
```
