---
title: Free n8n Automation
emoji: 🔄
colorFrom: indigo
colorTo: pink
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: Completely free self-hosted n8n with Typeform to WhatsApp
---

# Completely free n8n automation

Self-host **n8n Community Edition** at $0 and run a **Typeform → WhatsApp** lead alert.

n8n Cloud is not free. The Community Edition is free when you host it. This repo is a ready stack plus an importable workflow.

## Which host is actually free?

| Platform | Cost | Stays online? | Card needed? | Use it when |
| --- | --- | --- | --- | --- |
| **Hugging Face Spaces (Docker) + Supabase** | $0 | Sleeps if idle — ping it | No | **Start here.** Easiest zero-cost cloud |
| **Oracle Cloud Always Free VM** | $0 inside Always Free | Yes, 24/7 | Yes, for identity only | Webhooks and cron must never miss |
| **Your PC with Docker** | $0 | Only while the PC is on | No | Learning / testing |
| n8n Cloud, Railway, Render, Fly | Trial or sleep/paid | Unreliable on free tiers | Usually | Skip if the goal is $0 forever |

**Do not use the personal Vercel Hobby account** for this. Vercel is the wrong place for long-running n8n anyway.

Recommended path: **Hugging Face + Supabase + cron-job.org keep-alive**.

## 10-minute path (Hugging Face)

1. Create a free [Supabase](https://supabase.com) project (Postgres).
2. Create a free [Hugging Face](https://huggingface.co) **Docker** Space from this repo.
3. Add the secrets and variables listed in [`docs/HUGGINGFACE.md`](docs/HUGGINGFACE.md).
4. Open the Space URL, create the n8n owner account.
5. Import `workflows/typeform-to-whatsapp.json` and activate it.
6. Point Typeform’s webhook at `https://YOUR-SPACE.hf.space/webhook/typeform-lead`.
7. Create a free [cron-job.org](https://cron-job.org) job that hits `https://YOUR-SPACE.hf.space/healthz` every 10 minutes.

Full click-by-click: [`docs/HUGGINGFACE.md`](docs/HUGGINGFACE.md)  
Always-on VM: [`docs/ORACLE.md`](docs/ORACLE.md)  
WhatsApp + Typeform: [`docs/TYPEFORM-WHATSAPP.md`](docs/TYPEFORM-WHATSAPP.md)

## What the automation does

When someone submits your Typeform, n8n parses the answers and sends **you** a WhatsApp Cloud API message (name, email, phone, other fields).

WhatsApp Cloud API includes **1,000 free conversations / month**. Typeform’s free plan covers a limited number of responses. Together with self-hosted n8n, the whole path can stay at $0.

## Local test (Docker)

```bash
cp .env.example .env
openssl rand -hex 32   # paste into N8N_ENCRYPTION_KEY
docker compose up -d
```

Open http://localhost:5678, create the owner user, import the JSON under `workflows/`.

```bash
curl -X POST "http://localhost:5678/webhook-test/typeform-lead" \
  -H "Content-Type: application/json" \
  -d @samples/typeform-webhook.json
```

(Use `/webhook/typeform-lead` after the workflow is **Active**.)

## Repo layout

| Path | Role |
| --- | --- |
| `Dockerfile` | Hugging Face Space image (port 7860) |
| `docker-compose.yml` | Laptop / simple VM |
| `docker-compose.postgres.yml` | Oracle/VPS with Postgres + Caddy HTTPS |
| `workflows/*.json` | Import these in the n8n editor |
| `samples/typeform-webhook.json` | Fake Typeform payload for curl tests |

## Checks

```bash
npm test
```
