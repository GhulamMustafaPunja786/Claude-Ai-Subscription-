#!/usr/bin/env bash
# Creates .env from .env.example and fills in any secret that is still blank.
# Safe to re-run: existing values are never overwritten.

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

if [ ! -f .env ]; then
	cp .env.example .env
	step "Created .env from .env.example"
fi

random_secret() {
	if command -v openssl >/dev/null 2>&1; then
		openssl rand -hex 32
	else
		head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'
	fi
}

fill_if_blank() {
	local key="$1" current
	current="$(env_value "$key")"
	if [ -n "$current" ]; then
		info "  $key already set, leaving it alone"
		return 0
	fi
	local value
	value="$(random_secret)"
	if grep -q "^${key}=" .env; then
		# The value is hex only, so it needs no escaping.
		sed -i "s|^${key}=.*|${key}=${value}|" .env
	else
		printf '%s=%s\n' "$key" "$value" >> .env
	fi
	ok "Generated $key"
}

step "Generating missing secrets"
fill_if_blank N8N_ENCRYPTION_KEY
fill_if_blank N8N_USER_MANAGEMENT_JWT_SECRET
fill_if_blank POSTGRES_PASSWORD

chmod 600 .env

cat <<EOF

${C_YEL}Back up N8N_ENCRYPTION_KEY somewhere outside this server.${C_OFF}
It encrypts every credential you save in n8n. A database backup restored
without the matching key leaves all of those credentials unreadable.

  grep N8N_ENCRYPTION_KEY .env

Next: make up
EOF
