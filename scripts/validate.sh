#!/usr/bin/env bash
# Offline checks: compose files parse, workflow JSON is sane, shell scripts lint.
# Starts nothing, needs no .env. Safe to run in CI.

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

failures=0

step "Compose files"
# Dummy values so interpolation of required vars succeeds without a real .env.
export POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-validate}" \
	N8N_ENCRYPTION_KEY="${N8N_ENCRYPTION_KEY:-validate}" \
	N8N_USER_MANAGEMENT_JWT_SECRET="${N8N_USER_MANAGEMENT_JWT_SECRET:-validate}" \
	N8N_HOST="${N8N_HOST:-localhost}" \
	CLOUDFLARE_TUNNEL_TOKEN="${CLOUDFLARE_TUNNEL_TOKEN:-validate}"
for file in docker-compose.yml docker-compose.sqlite.yml; do
	if "${DC[@]}" -f "$file" --profile caddy --profile tunnel config -q 2>/dev/null; then
		ok "$file"
	else
		warn "$file failed to parse:"
		"${DC[@]}" -f "$file" --profile caddy --profile tunnel config -q || true
		failures=$((failures + 1))
	fi
done

step "Workflow JSON"
if python3 scripts/validate-workflows.py workflows; then
	ok "workflows"
else
	failures=$((failures + 1))
fi

step ".env.example covers every variable the compose files read"
missing=0
while read -r var; do
	case "$var" in
		# Fixed by the compose file itself or provided by Docker, not user config.
		POSTGRES_PASSWORD|N8N_ENCRYPTION_KEY|N8N_USER_MANAGEMENT_JWT_SECRET) continue ;;
	esac
	grep -q "^${var}=" .env.example || { warn "$var is used in compose but absent from .env.example"; missing=$((missing + 1)); }
done < <(grep -ohE '\$\{[A-Z0-9_]+' docker-compose.yml docker-compose.sqlite.yml | sed 's/\${//' | sort -u)
if [ "$missing" -eq 0 ]; then
	ok ".env.example is complete"
else
	failures=$((failures + 1))
fi

step "Shell scripts"
if command -v shellcheck >/dev/null 2>&1; then
	if shellcheck -x scripts/*.sh; then
		ok "shellcheck clean"
	else
		failures=$((failures + 1))
	fi
else
	# bash -n still catches syntax errors, which is the failure that matters most.
	for f in scripts/*.sh; do bash -n "$f" || failures=$((failures + 1)); done
	ok "syntax checked with bash -n (install shellcheck for the full lint)"
fi

step "Caddyfile"
if docker info >/dev/null 2>&1; then
	if docker run --rm -e N8N_HOST=example.com -e LETSENCRYPT_EMAIL=a@example.com \
		-v "$PWD/caddy/Caddyfile:/etc/caddy/Caddyfile:ro" caddy:2-alpine \
		caddy validate --config /etc/caddy/Caddyfile >/dev/null 2>&1; then
		ok "Caddyfile"
	else
		warn "caddy validate failed"
		failures=$((failures + 1))
	fi
else
	warn "Docker unavailable, skipping Caddyfile validation"
fi

echo
[ "$failures" -eq 0 ] || die "$failures check(s) failed"
ok "Everything validates"
