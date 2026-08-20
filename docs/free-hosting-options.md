# Where can you host n8n for free?

n8n itself is free when self-hosted. The question is which machine runs it for
$0 and stays awake. Most "free tier" hosts fail on the second half, and they fail
quietly: the editor works, workflows look active, and incoming webhooks vanish.

## The short list

| Platform | Free forever? | Always awake? | Verdict for n8n |
|---|---|---|---|
| **Oracle Cloud Always Free (Ampere ARM)** | Yes, no expiry | Yes | **Best choice.** 4 OCPU / 24 GB / 200 GB is far more than n8n needs |
| Oracle Cloud Always Free (AMD micro) | Yes, no expiry | Yes | Works with the SQLite stack. 1 GB RAM, add swap |
| Google Cloud e2-micro free tier | Yes, in 3 US regions | Yes | Workable: 1 GB RAM, use `docker-compose.sqlite.yml` |
| A spare laptop, mini PC or Raspberry Pi | Yes | As reliable as your power and internet | Genuinely free. Pair with Cloudflare Tunnel, no port forwarding |
| AWS / Azure micro instances | No, 12 months | Yes | Fine for a year, then it bills you |
| Render / Railway / similar PaaS free plans | No | No — free instances sleep or run on trial credit | Sleeping breaks webhooks and schedules. Avoid for n8n |
| Vercel / Netlify / Cloudflare Pages | N/A | N/A | Wrong shape entirely: n8n is a long-running stateful server, not a function |
| Hugging Face Spaces, Colab, notebooks | Sort of | No | Ephemeral storage and public exposure. Not for real automations |
| n8n Cloud | Trial only | Yes | Convenient, but the free window ends and then it is a subscription |

## Why Oracle wins

Oracle's Always Free allowance has no trial clock, unlike AWS's and Azure's
12-month offers. Within it you get, at the time of writing:

- Ampere A1 (ARM): up to 4 OCPUs and 24 GB of RAM total across your instances
- or 2 AMD micro VMs at 1 OCPU / 1 GB each
- 200 GB of block storage, 2 block volumes
- A public IPv4 address and a generous outbound transfer allowance

n8n idles at roughly 360 MB of RAM (measured, see the README), so even the
smallest shape works and the Ampere shape leaves room for Postgres, a proxy,
Redis queue mode later, and dozens of concurrent executions.

### The two real catches

**1. Ampere capacity is often unavailable.** In popular regions, creating an A1
instance returns "Out of host capacity" for days. Workarounds, in order of
effort:

- Pick a less busy region **when you create your tenancy** — the home region
  cannot be changed later.
- Ask for fewer resources: a 1 OCPU / 6 GB instance is far easier to get than
  4 OCPU / 24 GB, and is still plenty.
- Retry on a schedule. The capacity frees up in bursts.
- Fall back to the AMD micro shape (1 GB) with `docker-compose.sqlite.yml` and
  move to Ampere later. Migrating is an export and an import.

**2. Idle instances can be reclaimed.** Oracle may reclaim an Always Free
compute instance that looks unused, judged over the previous 7 days on CPU,
network and memory. A hobby n8n instance running one workflow a day can trip
this. Two mitigations:

- Give it real work. The uptime monitor in `workflows/03-uptime-monitor.json`
  polls every 15 minutes, which produces steady CPU and network activity, and
  `scripts/health-check.sh` on a cron adds more.
- Or upgrade the tenancy to Pay As You Go while using **only** Always Free
  resources. Idle reclamation does not apply to paid accounts, and the bill stays
  at zero as long as every resource you create is tagged Always Free. This is the
  standard trick for people who want a genuinely stable free box — just be
  careful, because it is now possible to create something billable by accident.

## Why the popular PaaS free plans do not work

They are optimised for websites that can sleep. n8n cannot:

- **Sleeping instances drop webhooks.** A provider that spins your service down
  after 15 idle minutes will refuse or delay the exact request you needed — a
  Typeform submission, a Stripe event, a WhatsApp message. Nothing in the n8n UI
  tells you it was missed.
- **Ephemeral disks lose credentials.** On free plans without a persistent
  volume, `/home/node/.n8n` disappears on redeploy, taking the SQLite database
  and the encryption key with it.
- **Trial credit is not a free tier.** A one-off credit runs out; that is a
  deferred bill, not free hosting.

If you still want the convenience of a PaaS, pay for the smallest paid instance
with a persistent disk. It costs a few dollars a month, which is a different
question from this document's.

## Hostname and HTTPS also cost nothing

You do not need to buy a domain to run this properly:

- **Cloudflare Tunnel** — free, no inbound ports, works behind NAT or CGNAT.
- **DuckDNS** — free subdomain that points at your IP; Caddy then obtains a
  Let's Encrypt certificate over HTTP-01.
- **`sslip.io` / `nip.io`** — magic DNS where the hostname encodes the IP, e.g.
  `n8n.203-0-113-5.sslip.io`. No signup at all.

Setup for each: [https-and-webhooks.md](https-and-webhooks.md).

## The licence question

n8n Community Edition is fair-code under the Sustainable Use License. You may
use it for internal business purposes and personal projects, and there is no cap
on workflows, executions or steps when you self-host. What is not permitted is
reselling n8n itself as a hosted product. Building automations for your own
business, or for a client on their own server, is within the licence.
