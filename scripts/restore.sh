#!/usr/bin/env bash
# Restores a backup created by ./scripts/backup.sh.
# Usage: ./scripts/restore.sh backups/2026-08-20T03-15-00Z [--yes]

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

dir="${1:-}"
[ -n "$dir" ] || die "Usage: $0 <backup-dir> [--yes]  (see: ls backups/)"
[ -d "$dir" ] || die "No such backup directory: $dir"

require_docker
require_env

if [ -f "$dir/MANIFEST.txt" ]; then
	info "Backup manifest:"
	sed 's/^/  /' "$dir/MANIFEST.txt"
	backup_fp="$(sed -n 's/^encryption_key_sha256_prefix=//p' "$dir/MANIFEST.txt")"
	current_fp="$(env_value N8N_ENCRYPTION_KEY | sha256sum | cut -c1-16)"
	if [ -n "$backup_fp" ] && [ "$backup_fp" != "$current_fp" ]; then
		warn "Encryption key in .env does NOT match the one used for this backup."
		warn "Workflows will restore fine, but every credential will fail to decrypt."
		warn "Put the original N8N_ENCRYPTION_KEY back in .env before continuing."
	fi
fi

if [ "${2:-}" != "--yes" ]; then
	read -r -p "Overwrite the current n8n data with $dir? Type yes: " confirm
	[ "$confirm" = "yes" ] || die "Aborted."
fi

if [ -f "$dir/postgres.sql.gz" ]; then
	pg_user="$(env_value POSTGRES_USER)"; pg_user="${pg_user:-n8n}"
	pg_db="$(env_value POSTGRES_DB)"; pg_db="${pg_db:-n8n}"
	pg_pass="$(env_value POSTGRES_PASSWORD)"

	step "Stopping n8n so nothing writes during the restore"
	compose stop n8n

	step "Restoring Postgres from $dir/postgres.sql.gz"
	gunzip -c "$dir/postgres.sql.gz" | compose exec -T -e PGPASSWORD="$pg_pass" postgres \
		psql -v ON_ERROR_STOP=0 -U "$pg_user" -d "$pg_db" >/dev/null

	step "Starting n8n"
	compose up -d n8n
	wait_for_n8n 240
else
	warn "No Postgres dump in this backup - importing the logical export instead."
	base="$(basename "$dir")"
	n8n_cli import:workflow --separate --input=/backups/"$base"/workflows | sed 's/^/  /'
	if [ -n "$(find "$dir/credentials" -name '*.json' 2>/dev/null)" ]; then
		n8n_cli import:credentials --separate --input=/backups/"$base"/credentials | sed 's/^/  /'
	fi
	compose restart n8n
	wait_for_n8n 240
fi

step "Workflows after restore"
n8n_cli list:workflow | sed 's/^/  /'
ok "Restore finished. Check that active workflows are still active in the editor."
