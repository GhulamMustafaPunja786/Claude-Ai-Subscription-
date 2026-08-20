#!/usr/bin/env bash
# Updates n8n to the tag pinned in .env: back up first, then pull and recreate.
# Bump N8N_IMAGE_TAG in .env before running this.

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

require_docker
require_env

tag="$(env_value N8N_IMAGE_TAG)"
info "Target n8n image tag: ${tag:-2.35.5 (default)}"
current="$(n8n_cli --version | tr -d '\r' | tail -n 1 || echo unknown)"
info "Currently running:    $current"

step "Backing up before the update"
./scripts/backup.sh

step "Pulling images"
compose pull

step "Recreating containers"
compose up -d
wait_for_n8n 300

new="$(n8n_cli --version | tr -d '\r' | tail -n 1)"
ok "n8n is now running $new"

step "Reclaiming disk from old image layers"
docker image prune -f | tail -n 1

warn "If a workflow misbehaves after the update, restore the backup this script just made."
