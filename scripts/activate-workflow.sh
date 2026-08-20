#!/usr/bin/env bash
# Activates a workflow by id and restarts n8n so its triggers register.
# Usage: ./scripts/activate-workflow.sh <workflow-id> [--no-restart]

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

id="${1:-}"
if [ -z "$id" ]; then
	info "Usage: $0 <workflow-id> [--no-restart]"
	info ""
	info "Available workflows:"
	n8n_cli list:workflow || true
	exit 1
fi

require_docker
require_env

step "Activating workflow $id"
n8n_cli update:workflow --id="$id" --active=true | sed 's/^/  /'

if [ "${2:-}" = "--no-restart" ]; then
	warn "Skipping restart. Webhook and schedule triggers stay dormant until n8n restarts."
	exit 0
fi

# Activation changed outside the editor is only picked up on boot: n8n registers
# webhook paths and cron jobs while starting.
step "Restarting n8n so the trigger registers"
compose restart n8n
wait_for_n8n 180

webhook_base="$(env_value WEBHOOK_URL)"
ok "Workflow $id is active. Webhook URLs live under ${webhook_base%/}/webhook/<path>"
