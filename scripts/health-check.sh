#!/usr/bin/env bash
# Reports whether n8n is actually serving, plus the resource numbers that matter
# on a free tier box. Exits non-zero when unhealthy, so it works as a cron guard:
#
#   */10 * * * * cd /opt/n8n && ./scripts/health-check.sh --quiet || make restart

# shellcheck source=scripts/lib.sh
source "$(dirname "$0")/lib.sh"

quiet=0
[ "${1:-}" = "--quiet" ] && quiet=1
say() { [ "$quiet" -eq 1 ] || info "$*"; }

require_docker
failures=0

say "Containers"
if [ "$quiet" -eq 0 ]; then
	compose ps
fi
for svc in $(compose ps --services); do
	state="$(compose ps --format '{{.Service}} {{.State}}' | awk -v s="$svc" '$1==s {print $2}')"
	if [ "$state" != "running" ]; then
		warn "service $svc is '$state', not running"
		failures=$((failures + 1))
	fi
done

say ""
say "Internal health endpoint"
if n8n_is_healthy; then
	say "  /healthz ok"
else
	warn "/healthz did not respond inside the container"
	failures=$((failures + 1))
fi

# Only worth checking when a real public URL is configured.
public_url="$(env_value WEBHOOK_URL)"
if [ -n "$public_url" ] && [[ "$public_url" != *localhost* ]] && [[ "$public_url" != *127.0.0.1* ]]; then
	say ""
	say "Public URL"
	code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "${public_url%/}/healthz" || echo 000)"
	if [ "$code" = "200" ]; then
		say "  ${public_url%/}/healthz -> 200"
	else
		warn "${public_url%/}/healthz returned $code - check DNS, the proxy, or the tunnel"
		failures=$((failures + 1))
	fi
fi

if [ "$quiet" -eq 0 ]; then
	info ""
	info "Resources"
	free -h 2>/dev/null | sed 's/^/  /' || true
	df -h / 2>/dev/null | sed 's/^/  /' || true
	docker system df 2>/dev/null | sed 's/^/  /' || true
fi

if [ "$failures" -gt 0 ]; then
	die "$failures health check(s) failed"
fi
ok "All health checks passed"
