#!/usr/bin/env bash
# Exports workflows and credentials from the running instance into ./backups.
# Credentials are exported encrypted unless you pass --decrypted.
# Usage: ./scripts/export-workflows.sh [--decrypted]

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

require_docker
require_env

ts="$(date -u +%Y-%m-%dT%H-%M-%SZ)"
dest="backups/$ts"
mkdir -p "$dest"

cred_args=(--all --separate --output=/backups/"$ts"/credentials)
if [ "${1:-}" = "--decrypted" ]; then
	warn "Exporting credentials in PLAINTEXT. Delete the files once you are done."
	cred_args+=(--decrypted)
fi

compose exec -T n8n sh -c "mkdir -p /backups/$ts/workflows /backups/$ts/credentials"

step "Exporting workflows"
n8n_cli export:workflow --all --separate --output=/backups/"$ts"/workflows | sed 's/^/  /'

step "Exporting credentials"
n8n_cli export:credentials "${cred_args[@]}" | sed 's/^/  /' \
	|| warn "No credentials to export (expected on a fresh instance)."

ok "Exported to $dest"
find "$dest" -type f | sort
