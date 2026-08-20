# Free HTTPS, free hostnames, working webhooks

Two things must be true before an external service can trigger your workflows:
the instance is reachable over HTTPS, and n8n knows its own public URL. Getting
the first right and the second wrong is the most common way to end up with
triggers that never fire and no error message anywhere.

## Getting a hostname without paying

| Option | Cost | Notes |
|---|---|---|
| Your own domain | ~$1–15/year | Cleanest. Any registrar, any TLD |
| **DuckDNS** | free | `yourname.duckdns.org` pointed at your IP. Update it from cron if the IP changes |
| **sslip.io / nip.io** | free, no signup | `n8n.203-0-113-5.sslip.io` resolves to `203.0.113.5` automatically |
| **Cloudflare Tunnel** | free | Needs a domain in a Cloudflare account, but no open ports and no DNS work |

DuckDNS and sslip.io both work with Let's Encrypt's HTTP-01 challenge, so the
Caddy profile issues real certificates for them with no extra plugins.

## Option A — Caddy with Let's Encrypt

Best when ports 80 and 443 can be reached from the internet.

```bash
# .env
N8N_HOST=n8n.yourdomain.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.yourdomain.com/
N8N_PROXY_HOPS=1
N8N_SECURE_COOKIE=true
LETSENCRYPT_EMAIL=you@example.com

make up-caddy
```

Caddy obtains and renews the certificate on its own. Requirements: the hostname
resolves to this machine, ports 80 and 443 are open in *both* the cloud firewall
and the OS firewall, and nothing else is bound to those ports.

`make up-caddy` runs `scripts/preflight.sh caddy` first, which checks the DNS
record against the machine's public IP and refuses to start on a
`localhost`-shaped configuration.

## Option B — Cloudflare Tunnel

Best when you cannot open ports: home network, CGNAT, a locked-down cloud
firewall, or you simply do not want an open port.

1. Add any domain to Cloudflare (free plan is fine).
2. Zero Trust → Networks → Tunnels → **Create a tunnel** → Cloudflared.
3. Copy the token out of the `docker run` command Cloudflare shows — just the
   token, not the whole line.
4. Add a **Public hostname**: pick your subdomain, service type `HTTP`, URL
   `n8n:5678`. That is the container name on the Compose network, which is why no
   port needs publishing.
5. Configure and start:

   ```bash
   # .env
   N8N_HOST=n8n.yourdomain.com
   N8N_PROTOCOL=https
   WEBHOOK_URL=https://n8n.yourdomain.com/
   N8N_PROXY_HOPS=1
   N8N_SECURE_COOKIE=true
   CLOUDFLARE_TUNNEL_TOKEN=eyJ...

   make up-tunnel
   ```

Cloudflare terminates TLS at its edge. If the orange-cloud proxy is also in
front of another proxy of yours, set `N8N_PROXY_HOPS=2`.

For a five-minute throwaway test you can skip the account entirely:

```bash
docker run --rm --network n8n-free_n8n cloudflare/cloudflared:latest \
  tunnel --url http://n8n:5678
```

It prints a random `*.trycloudflare.com` URL that lives as long as the command
does. Fine for testing a webhook, useless as an address you paste into Stripe.

## The four variables that decide whether webhooks work

```bash
N8N_HOST=n8n.example.com          # public hostname, no scheme, no port
N8N_PROTOCOL=https                # scheme used in generated URLs
WEBHOOK_URL=https://n8n.example.com/   # exact public base, trailing slash
N8N_PROXY_HOPS=1                  # proxies in front of n8n
```

`WEBHOOK_URL` is the one that bites. n8n builds every webhook address it shows
you from it. Leave it unset and n8n falls back to its internal host and port, so
the editor cheerfully displays `http://localhost:5678/webhook/abc` or
`https://n8n.example.com:5678/webhook/abc`. Both look plausible, both are
unreachable from the internet, and neither produces an error — the external
service just gets a connection failure you never see.

Check it after starting: open any Webhook node and confirm the production URL is
`https://your.domain/webhook/...` with no port number.

`N8N_PROXY_HOPS` tells n8n how many proxies to trust in `X-Forwarded-For`. Too
low and rate limiting and logs see the proxy's IP instead of the caller's; too
high and a caller can spoof its IP.

`N8N_SECURE_COOKIE=true` marks the session cookie secure, which browsers only
send over HTTPS. Set it once you are actually on `https://`; leaving it true
while testing over plain HTTP makes login appear to succeed and then bounce you
straight back to the login page.

## Verifying end to end

```bash
make import
./scripts/activate-workflow.sh n8nfreehello0001

curl -X POST https://your.domain/webhook/hello \
  -H 'Content-Type: application/json' \
  -d '{"name":"production"}'
# {"ok":true,"message":"Hello, production!","receivedAt":"...","echo":{"name":"production"}}
```

If that returns your greeting, every layer works: DNS, TLS, the proxy or tunnel,
n8n's webhook registration and the workflow itself.

Note the two URL forms n8n uses. `/webhook-test/<path>` only answers while you
have the editor open with **Listen for test event** armed; `/webhook/<path>` is
the production URL and only answers when the workflow is **active**. A 404 on the
production path almost always means the workflow is inactive.
