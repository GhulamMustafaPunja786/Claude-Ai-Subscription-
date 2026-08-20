#!/usr/bin/env bash
# Imports every JSON file in ./workflows into the running n8n instance.
# Workflows arrive deactivated - activate them from the editor, or with
# ./scripts/activate-workflow.sh <id>.

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

require_docker
require_env

count="$(find workflows -maxdepth 1 -name '*.json' | wc -l | tr -d ' ')"
[ "$count" -gt 0 ] || die "No .json files found in ./workflows"

compose ps --status running --services 2>/dev/null | grep -qx n8n \
	|| die "The n8n container is not running. Start it with: make up"

step "Importing $count workflow file(s) from ./workflows"
n8n_cli import:workflow --separate --input=/workflows | sed 's/^/  /'

step "Workflows now in this instance (id | name)"
n8n_cli list:workflow | sed 's/^/  /'

cat <<EOF

Imported workflows are inactive - re-importing an existing one deactivates it
too. Turn one on with:

  ./scripts/activate-workflow.sh <id>

or open the editor and flip the Active switch.
EOF
