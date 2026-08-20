#!/usr/bin/env bash
# Checks .env before exposing n8n to the internet. Run by `make up-caddy` and
# `make up-tunnel`. Usage: ./scripts/preflight.sh caddy|tunnel

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

mode="${1:-}"
case "$mode" in
	caddy|tunnel) ;;
	*) die "Usage: $0 caddy|tunnel" ;;
esac

require_env
problems=0

fail_check() { warn "$*"; problems=$((problems + 1)); }

host="$(env_value N8N_HOST)"
protocol="$(env_value N8N_PROTOCOL)"
webhook="$(env_value WEBHOOK_URL)"
hops="$(env_value N8N_PROXY_HOPS)"
secure_cookie="$(env_value N8N_SECURE_COOKIE)"
bind="$(env_value N8N_BIND_ADDRESS)"

step "Checking public configuration in .env"

case "$host" in
	""|localhost|127.0.0.1) fail_check "N8N_HOST is '$host'. Set it to the domain you will actually open." ;;
	*.*) ok "N8N_HOST=$host" ;;
	*) fail_check "N8N_HOST='$host' does not look like a domain." ;;
esac

[ "$protocol" = "https" ] || fail_check "N8N_PROTOCOL should be https for a public instance (currently '$protocol')."

# A missing trailing slash or a stale localhost value here is the classic reason
# webhooks look fine in the editor and never fire in production.
if [ "$webhook" != "https://${host}/" ]; then
	fail_check "WEBHOOK_URL should be exactly https://${host}/ (with the trailing slash), found '$webhook'."
else
	ok "WEBHOOK_URL=$webhook"
fi

[ "$hops" = "1" ] || fail_check "N8N_PROXY_HOPS should be 1 behind Caddy or a tunnel (currently '$hops'). Use 2 if Cloudflare's orange-cloud proxy is also in front."
[ "$secure_cookie" = "true" ] || fail_check "N8N_SECURE_COOKIE should be true once you are on https (currently '$secure_cookie')."

if [ "$bind" = "0.0.0.0" ]; then
	fail_check "N8N_BIND_ADDRESS=0.0.0.0 publishes the unencrypted editor on the VM's public IP. Use 127.0.0.1 and let the proxy terminate TLS."
fi

if [ "$mode" = "caddy" ]; then
	email="$(env_value LETSENCRYPT_EMAIL)"
	[ -n "$email" ] || fail_check "LETSENCRYPT_EMAIL is empty. Let's Encrypt uses it for expiry warnings."

	if command -v getent >/dev/null 2>&1 && [ -n "$host" ]; then
		resolved="$(getent hosts "$host" | awk '{print $1}' | head -n 1 || true)"
		public_ip="$(curl -s --max-time 10 https://api.ipify.org || true)"
		if [ -z "$resolved" ]; then
			fail_check "$host does not resolve yet. Add a DNS A record pointing at this VM, then wait for propagation."
		elif [ -n "$public_ip" ] && [ "$resolved" != "$public_ip" ]; then
			warn "$host resolves to $resolved but this VM's public IP is $public_ip."
			warn "That is expected behind Cloudflare's proxy; otherwise HTTP-01 certificate issuance will fail."
		else
			ok "$host resolves to $resolved"
		fi
	fi

	for port in 80 443; do
		if command -v ss >/dev/null 2>&1 && ss -ltn 2>/dev/null | grep -q ":$port "; then
			fail_check "Port $port is already in use. Stop the other web server (nginx, apache) first."
		fi
	done
else
	token="$(env_value CLOUDFLARE_TUNNEL_TOKEN)"
	if [ -z "$token" ]; then
		fail_check "CLOUDFLARE_TUNNEL_TOKEN is empty. Zero Trust > Networks > Tunnels > Create > Docker gives you the token."
	elif [ "${#token}" -lt 40 ]; then
		fail_check "CLOUDFLARE_TUNNEL_TOKEN looks too short (${#token} chars) - copy only the token, not the whole docker command."
	else
		ok "Tunnel token present (${#token} chars)"
	fi
	info "  Reminder: in the tunnel's public hostname, the service must be http://n8n:5678"
fi

echo
if [ "$problems" -gt 0 ]; then
	die "$problems problem(s) found. Fix .env and re-run, or start with plain 'make up' for local-only access."
fi
ok "Preflight passed - safe to expose"
