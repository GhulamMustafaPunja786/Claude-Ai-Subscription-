#!/usr/bin/env bash
# One-command setup for a fresh free-tier VM (Ubuntu/Debian or Oracle Linux/RHEL,
# x86_64 or ARM64): installs Docker, adds swap on small boxes, opens the HTTPS
# ports, and generates .env. Idempotent - re-running it is safe.
#
#   curl -fsSL https://raw.githubusercontent.com/<you>/<repo>/main/scripts/bootstrap.sh | bash
# or, after cloning:
#   ./scripts/bootstrap.sh [--no-firewall] [--no-swap]

set -euo pipefail

NO_FIREWALL=0
NO_SWAP=0
for arg in "$@"; do
	case "$arg" in
		--no-firewall) NO_FIREWALL=1 ;;
		--no-swap) NO_SWAP=1 ;;
		*) echo "Unknown flag: $arg" >&2; exit 1 ;;
	esac
done

step() { printf '\n==> %s\n' "$*"; }
warn() { printf 'warn %s\n' "$*" >&2; }
die() { printf 'fail %s\n' "$*" >&2; exit 1; }

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
	command -v sudo >/dev/null 2>&1 || die "Run as root, or install sudo."
	SUDO="sudo"
fi

if command -v apt-get >/dev/null 2>&1; then
	PKG=apt
elif command -v dnf >/dev/null 2>&1; then
	PKG=dnf
else
	die "Unsupported distro: need apt-get or dnf."
fi

step "System: $(uname -m), $( (. /etc/os-release && echo "$PRETTY_NAME") 2>/dev/null || echo unknown), package manager $PKG"

step "Installing base packages"
case "$PKG" in
	apt)
		$SUDO apt-get update -qq
		$SUDO DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
			ca-certificates curl git make openssl jq
		;;
	dnf)
		$SUDO dnf install -y -q ca-certificates curl git make openssl jq
		;;
esac

if command -v docker >/dev/null 2>&1; then
	step "Docker already installed: $(docker --version)"
else
	step "Installing Docker Engine via get.docker.com"
	curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
	$SUDO sh /tmp/get-docker.sh
	rm -f /tmp/get-docker.sh
fi

if ! docker compose version >/dev/null 2>&1; then
	step "Installing the Compose plugin"
	case "$PKG" in
		apt) $SUDO apt-get install -y -qq docker-compose-plugin ;;
		dnf) $SUDO dnf install -y -q docker-compose-plugin ;;
	esac
fi

step "Enabling the Docker service"
if command -v systemctl >/dev/null 2>&1; then
	$SUDO systemctl enable --now docker
else
	warn "No systemd here; start the daemon yourself (dockerd &)."
fi

if ! id -nG "$USER" 2>/dev/null | tr ' ' '\n' | grep -qx docker; then
	step "Adding $USER to the docker group"
	$SUDO usermod -aG docker "$USER" || true
	warn "Log out and back in (or run: newgrp docker) before docker works without sudo."
fi

# n8n plus a browser-side build of the editor can spike past 1 GB. Swap turns an
# OOM kill into a slow request, which matters a lot on the smallest free shapes.
if [ "$NO_SWAP" -eq 0 ]; then
	total_mb="$(awk '/MemTotal/ {printf "%d", $2/1024}' /proc/meminfo)"
	swap_mb="$(awk '/SwapTotal/ {printf "%d", $2/1024}' /proc/meminfo)"
	if [ "$total_mb" -lt 2048 ] && [ "$swap_mb" -lt 512 ]; then
		step "Only ${total_mb} MB RAM and ${swap_mb} MB swap - adding a 2 GB swapfile"
		$SUDO fallocate -l 2G /swapfile 2>/dev/null || $SUDO dd if=/dev/zero of=/swapfile bs=1M count=2048
		$SUDO chmod 600 /swapfile
		$SUDO mkswap /swapfile >/dev/null
		$SUDO swapon /swapfile
		grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | $SUDO tee -a /etc/fstab >/dev/null
	else
		step "Memory looks fine (${total_mb} MB RAM, ${swap_mb} MB swap) - no swapfile needed"
	fi
fi

if [ "$NO_FIREWALL" -eq 0 ]; then
	step "Opening ports 80 and 443 in the OS firewall"
	if command -v firewall-cmd >/dev/null 2>&1 && $SUDO firewall-cmd --state >/dev/null 2>&1; then
		$SUDO firewall-cmd --permanent --add-service=http
		$SUDO firewall-cmd --permanent --add-service=https
		$SUDO firewall-cmd --reload
	elif command -v ufw >/dev/null 2>&1 && $SUDO ufw status | grep -q active; then
		$SUDO ufw allow 80/tcp
		$SUDO ufw allow 443/tcp
	elif command -v iptables >/dev/null 2>&1; then
		# Oracle's stock images ship an iptables INPUT chain that ends in REJECT,
		# so new rules have to be inserted above it rather than appended.
		for port in 80 443; do
			$SUDO iptables -C INPUT -p tcp --dport "$port" -j ACCEPT 2>/dev/null \
				|| $SUDO iptables -I INPUT 1 -p tcp --dport "$port" -j ACCEPT
		done
		if command -v netfilter-persistent >/dev/null 2>&1; then
			$SUDO netfilter-persistent save
		elif [ -d /etc/iptables ]; then
			$SUDO sh -c 'iptables-save > /etc/iptables/rules.v4'
		else
			warn "Could not persist iptables rules - they will vanish on reboot."
		fi
	else
		warn "No known firewall tool found; skipping."
	fi
fi

cd "$(cd "$(dirname "$0")/.." && pwd)"
step "Generating .env"
./scripts/gen-env.sh

cat <<'EOF'

==> Bootstrap done. Remaining steps:

  1. Cloud firewall (separate from the OS one):
     Oracle Cloud -> Networking -> VCN -> Subnet -> Security List
     Add ingress rules for TCP 80 and 443 from 0.0.0.0/0.
     Skip this if you use the Cloudflare Tunnel option, which needs no inbound ports.

  2. Point a hostname at this VM, then edit .env:
       N8N_HOST=n8n.yourdomain.com
       N8N_PROTOCOL=https
       WEBHOOK_URL=https://n8n.yourdomain.com/
       N8N_PROXY_HOPS=1
       N8N_SECURE_COOKIE=true
       LETSENCRYPT_EMAIL=you@example.com

  3. Start it:
       make up-caddy          # HTTPS via Let's Encrypt
       make up-tunnel         # or: Cloudflare Tunnel, no open ports
       make LITE=1 up         # or: 1 GB box, SQLite, no Postgres

  4. Verify and load the sample automations:
       make health
       make import

  5. Add a nightly backup:
       (crontab -l 2>/dev/null; echo "15 3 * * * cd $PWD && ./scripts/backup.sh >> /var/log/n8n-backup.log 2>&1") | crontab -
EOF
