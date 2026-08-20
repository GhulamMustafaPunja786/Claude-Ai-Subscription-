#!/usr/bin/env bash
# One-time bootstrap for a fresh Ubuntu VM (Oracle Cloud "Always Free" Ampere A1,
# or Google Cloud e2-micro, or any other free-tier VM).
#
# What it does:
#   1. Installs Docker Engine + the Docker Compose plugin.
#   2. Opens the firewall (ufw) for SSH/HTTP/HTTPS.
#   3. Leaves you ready to run `docker compose up -d` from this folder.
#
# Usage:
#   scp -r n8n-free-hosting <user>@<vm-ip>:~/
#   ssh <user>@<vm-ip>
#   cd n8n-free-hosting && chmod +x scripts/setup-vm.sh && ./scripts/setup-vm.sh
#
# NOTE: Oracle Cloud instances additionally require opening ports 80/443 in the
# VCN Security List / Network Security Group from the OCI web console — ufw
# alone is not enough there. See ../README.md for details.

set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
  echo "Please run this script as a normal sudo-capable user, not root." >&2
  exit 1
fi

echo "==> Updating package index"
sudo apt-get update -y

echo "==> Installing prerequisites"
sudo apt-get install -y ca-certificates curl gnupg ufw

echo "==> Installing Docker Engine + Compose plugin (official script)"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  rm -f get-docker.sh
  sudo usermod -aG docker "$USER"
else
  echo "Docker already installed, skipping."
fi

echo "==> Configuring firewall (ufw)"
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

cat <<'EOF'

==> Done.

Next steps:
  1. Log out and back in (or run `newgrp docker`) so your user can run docker
     without sudo.
  2. Point your domain's DNS A record at this VM's public IP.
  3. Copy .env.example to .env and fill in N8N_HOST / N8N_ENCRYPTION_KEY.
  4. Run: docker compose up -d
  5. Visit https://<your-domain> and create the n8n owner account.

If you are on Oracle Cloud, also open ports 80 and 443 (and optionally 5678
for direct debugging) in your VCN's Security List / Network Security Group
from the OCI console — the OS firewall alone will not let traffic through.
EOF
