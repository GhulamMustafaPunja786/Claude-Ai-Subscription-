#!/usr/bin/env bash
# End-to-end proof that the stack works: boot it, import the samples, activate the
# webhook workflow, fire a real HTTP request at it and check the response body.
#
#   ./scripts/smoke-test.sh                 # local-only checks, deterministic
#   ./scripts/smoke-test.sh --with-network  # also run the samples that call the internet
#   LITE=1 ./scripts/smoke-test.sh          # same test against the SQLite stack

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

WITH_NETWORK=0
[ "${1:-}" = "--with-network" ] && WITH_NETWORK=1

HELLO_ID="n8nfreehello0001"
UPTIME_ID="n8nfreeuptime003"
DIGEST_ID="n8nfreedigest002"

require_docker
./scripts/gen-env.sh >/dev/null

port="$(env_value N8N_PUBLISHED_PORT)"; port="${port:-5678}"
base="http://127.0.0.1:${port}"

step "1/7 Starting the stack ($COMPOSE_FILE)"
compose up -d
wait_for_n8n 300

step "2/7 Checking the health endpoint from outside the container"
health="$(curl -sf --max-time 15 "$base/healthz" || die "GET $base/healthz failed")"
info "  $health"
ok "n8n is serving on $base"

step "3/7 Importing ./workflows"
n8n_cli import:workflow --separate --input=/workflows | sed 's/^/  /'

listing="$(n8n_cli list:workflow | tr -d '\r')"
info "$listing" | sed 's/^/  /'
for id in "$HELLO_ID" "$DIGEST_ID" "$UPTIME_ID"; do
	grep -q "$id" <<<"$listing" || die "workflow $id is missing after import"
done
ok "All 3 sample workflows imported"

step "4/7 Activating $HELLO_ID and restarting so the webhook registers"
n8n_cli update:workflow --id="$HELLO_ID" --active=true >/dev/null
compose restart n8n >/dev/null
wait_for_n8n 300

step "5/7 Calling the production webhook"
payload='{"name":"free tier"}'
response="$(curl -sf --max-time 30 -X POST "$base/webhook/hello" \
	-H 'Content-Type: application/json' -d "$payload" || die "POST $base/webhook/hello failed")"
info "  request:  $payload"
info "  response: $response"

grep -q '"ok":true' <<<"$response" || die "response did not contain \"ok\":true"
grep -q 'Hello, free tier!' <<<"$response" || die "response did not contain the expected greeting"
grep -q '"echo"' <<<"$response" || die "response did not echo the request body"
ok "Webhook executed the workflow and answered with the transformed payload"

step "6/7 Checking an unregistered path 404s (no accidental catch-all)"
code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$base/webhook/definitely-not-registered")"
[ "$code" = "404" ] || die "expected 404 for an unknown webhook path, got $code"
ok "Unknown webhook paths return 404"

step "7/7 Workflow JSON validation"
python3 scripts/validate-workflows.py workflows | sed 's/^/  /'

if [ "$WITH_NETWORK" -eq 1 ]; then
	# The two scheduled samples call the internet. The n8n CLI cannot start a
	# schedule-triggered workflow (it needs an Execute Workflow Trigger), so what
	# is checkable from here is whether their endpoints are reachable at all.
	step "Extra: outbound reachability for the scheduled samples"
	for url in \
		"https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&forecast_days=1" \
		"https://docs.n8n.io/"; do
		if compose exec -T n8n wget -q -O /dev/null --timeout=15 "$url"; then
			ok "reachable: ${url%%\?*}"
		else
			die "the n8n container cannot reach ${url%%\?*} - check egress rules or DNS"
		fi
	done
	info "  Run the scheduled samples from the editor with the 'Execute workflow' button."
fi

echo
ok "SMOKE TEST PASSED"
info ""
info "  stack:        $COMPOSE_FILE"
info "  n8n version:  $(n8n_cli --version | tr -d '\r' | tail -n 1)"
info "  editor:       $base"
info "  live webhook: $base/webhook/hello"
