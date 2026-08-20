#!/usr/bin/env bash
# Exports all n8n workflows and credentials (encrypted) to a timestamped
# folder, and tars it up. Run this from the same directory as
# docker-compose.yml, e.g. via a nightly cron job:
#
#   0 3 * * * /home/ubuntu/n8n-free-hosting/scripts/backup.sh >> /home/ubuntu/n8n-backup.log 2>&1

set -euo pipefail

cd "$(dirname "$0")/.."

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="backups/${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"

echo "==> Exporting workflows"
docker compose exec -T n8n n8n export:workflow --all --output=/home/node/.n8n/backup-workflows.json
docker compose cp n8n:/home/node/.n8n/backup-workflows.json "${BACKUP_DIR}/workflows.json"

echo "==> Exporting credentials (still encrypted with your N8N_ENCRYPTION_KEY)"
docker compose exec -T n8n n8n export:credentials --all --output=/home/node/.n8n/backup-credentials.json
docker compose cp n8n:/home/node/.n8n/backup-credentials.json "${BACKUP_DIR}/credentials.json"

docker compose exec -T n8n rm -f /home/node/.n8n/backup-workflows.json /home/node/.n8n/backup-credentials.json

tar -czf "backups/${TIMESTAMP}.tar.gz" -C backups "${TIMESTAMP}"
rm -rf "${BACKUP_DIR}"

echo "==> Backup written to backups/${TIMESTAMP}.tar.gz"
echo "==> Copy this file off the VM (e.g. to GitHub, Google Drive, S3-compatible storage) regularly."

# Keep only the last 14 backups locally to avoid filling the free-tier disk.
ls -1t backups/*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
