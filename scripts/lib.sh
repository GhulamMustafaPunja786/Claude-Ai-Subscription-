#!/usr/bin/env bash
# Shared helpers for the scripts in this directory. Not meant to be run directly.
# shellcheck shell=bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if [ -t 1 ]; then
	C_RED=$'\033[31m'; C_YEL=$'\033[33m'; C_GRN=$'\033[32m'; C_DIM=$'\033[2m'; C_OFF=$'\033[0m'
else
	C_RED=""; C_YEL=""; C_GRN=""; C_DIM=""; C_OFF=""
fi

info() { printf '%s\n' "$*"; }
step() { printf '%s==>%s %s\n' "$C_DIM" "$C_OFF" "$*"; }
ok()   { printf '%s  ok%s %s\n' "$C_GRN" "$C_OFF" "$*"; }
warn() { printf '%swarn%s %s\n' "$C_YEL" "$C_OFF" "$*" >&2; }
die()  { printf '%sfail%s %s\n' "$C_RED" "$C_OFF" "$*" >&2; exit 1; }

# LITE=1 switches every script to the SQLite stack for 1 GB machines.
if [ "${LITE:-0}" = "1" ]; then
	COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.sqlite.yml}"
else
	COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
fi

if docker compose version >/dev/null 2>&1; then
	DC=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
	DC=(docker-compose)
else
	die "Docker Compose not found. Run ./scripts/bootstrap.sh to install it."
fi

compose() { "${DC[@]}" -f "$COMPOSE_FILE" "$@"; }

# Runs an n8n CLI command inside the container. n8n prints two harmless lines on
# every invocation (a Confluence credential-loading warning and the migration
# lock notice); they drown out the actual result, so they are filtered out while
# the command's exit status is preserved.
n8n_cli() {
	local status=0 out
	out="$(compose exec -T n8n n8n "$@" 2>&1)" || status=$?
	printf '%s\n' "$out" \
		| grep -vE 'Failed to load Custom API options for the node|Acquiring database migration lock' \
		| grep -v '^$' || true
	return "$status"
}

require_docker() {
	docker info >/dev/null 2>&1 && return 0
	if command -v sudo >/dev/null 2>&1 && sudo -n docker info >/dev/null 2>&1; then
		die "Docker needs sudo for this user. Run: sudo usermod -aG docker $USER, then log out and back in."
	fi
	die "Cannot talk to the Docker daemon. Is it running? (sudo systemctl start docker)"
}

require_env() {
	[ -f .env ] || die ".env is missing. Run ./scripts/gen-env.sh first."
}

# Reads a single key out of .env without sourcing the whole file.
env_value() {
	local key="$1"
	[ -f .env ] || return 0
	sed -n "s/^${key}=//p" .env | tail -n 1
}

# True when the n8n container is up and answering /healthz.
n8n_is_healthy() {
	compose exec -T n8n wget -q -O /dev/null http://127.0.0.1:5678/healthz 2>/dev/null
}

wait_for_n8n() {
	local timeout="${1:-180}" waited=0
	step "Waiting for n8n to answer /healthz (up to ${timeout}s)"
	while [ "$waited" -lt "$timeout" ]; do
		if n8n_is_healthy; then
			ok "n8n is healthy after ${waited}s"
			return 0
		fi
		sleep 5
		waited=$((waited + 5))
	done
	compose logs --tail=40 n8n >&2 || true
	die "n8n did not become healthy within ${timeout}s"
}
