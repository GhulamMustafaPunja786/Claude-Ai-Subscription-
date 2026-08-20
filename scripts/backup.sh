#!/usr/bin/env bash
# Backs up everything that matters: a logical export of workflows and
# credentials, plus a full Postgres dump when running the Postgres stack.
# Keeps the most recent $BACKUP_KEEP backups (default 7).
#
# Cron example (daily at 03:15, keeping the log):
#   15 3 * * * cd /opt/n8n && ./scripts/backup.sh >> /var/log/n8n-backup.log 2>&1

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

require_docker
require_env

BACKUP_KEEP="${BACKUP_KEEP:-7}"
ts="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
dest="backups/$ts"
mkdir -p "$dest"

compose exec -T n8n sh -c "mkdir -p /backups/$ts/workflows /backups/$ts/credentials"

step "Exporting workflows"
n8n_cli export:workflow --all --separate --output=/backups/"$ts"/workflows | sed 's/^/  /'

step "Exporting credentials"
# A fresh instance has no credentials, and the CLI exits non-zero for that.
cred_log="$(mktemp)"
if n8n_cli export:credentials --all --separate --output=/backups/"$ts"/credentials >"$cred_log" 2>&1; then
	sed 's/^/  /' "$cred_log"
elif grep -q 'No credentials found' "$cred_log"; then
	info "  no credentials stored yet, nothing to export"
else
	warn "credential export failed:"
	sed 's/^/    /' "$cred_log"
fi
rm -f "$cred_log"

if [ "$COMPOSE_FILE" = "docker-compose.yml" ]; then
	step "Dumping Postgres"
	pg_user="$(env_value POSTGRES_USER)"; pg_user="${pg_user:-n8n}"
	pg_db="$(env_value POSTGRES_DB)"; pg_db="${pg_db:-n8n}"
	pg_pass="$(env_value POSTGRES_PASSWORD)"
	compose exec -T -e PGPASSWORD="$pg_pass" postgres \
		pg_dump --clean --if-exists -U "$pg_user" -d "$pg_db" | gzip > "$dest/postgres.sql.gz"
	ok "postgres.sql.gz $(du -h "$dest/postgres.sql.gz" | cut -f1)"
else
	warn "SQLite stack: execution history is not included, only workflows and credentials."
fi

# The key fingerprint lets restore.sh detect a mismatched encryption key before
# you discover it as a pile of unreadable credentials.
key_fp="$(env_value N8N_ENCRYPTION_KEY | sha256sum | cut -c1-16)"
n8n_version="$(n8n_cli --version | tr -d '\r' | tail -n 1)"

cat > "$dest/MANIFEST.txt" <<EOF
created_utc=$ts
compose_file=$COMPOSE_FILE
n8n_version=$n8n_version
encryption_key_sha256_prefix=$key_fp
workflow_files=$(find "$dest/workflows" -name '*.json' 2>/dev/null | wc -l | tr -d ' ')
credential_files=$(find "$dest/credentials" -name '*.json' 2>/dev/null | wc -l | tr -d ' ')
EOF

step "Pruning old backups (keeping $BACKUP_KEEP)"
mapfile -t all_backups < <(find backups -maxdepth 1 -mindepth 1 -type d | sort -r)
if [ "${#all_backups[@]}" -gt "$BACKUP_KEEP" ]; then
	for old in "${all_backups[@]:$BACKUP_KEEP}"; do
		rm -rf "$old"
		info "  removed $old"
	done
fi

ok "Backup complete: $dest ($(du -sh "$dest" | cut -f1))"
cat "$dest/MANIFEST.txt"
warn "backups/ lives on the same disk as n8n. Copy it off the box (rclone, scp, git-crypt) for it to count as a real backup."
