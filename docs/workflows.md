# The sample automations

Three workflows that run on a free instance with no API keys and no paid
services. Import them all with `make import`; they arrive **inactive** so nothing
starts firing behind your back.

```bash
make import
./scripts/activate-workflow.sh n8nfreehello0001
```

## 01 — Hello Webhook

`workflows/01-hello-webhook.json` · id `n8nfreehello0001`

```
Webhook (POST /hello) → Code (build reply) → Respond to Webhook
```

The smallest useful automation, and the one to point a new integration at first.
It echoes back whatever it received, so you can see the exact shape of a
Typeform submission, a Stripe event or a chat platform's payload before you build
anything on top of it.

```bash
curl -X POST https://your.domain/webhook/hello \
  -H 'Content-Type: application/json' -d '{"name":"Ada"}'
# {"ok":true,"message":"Hello, Ada!","receivedAt":"...","echo":{"name":"Ada"}}
```

`scripts/smoke-test.sh` uses this workflow to prove an instance works end to end.

**Adapting it.** Replace the Code node with whatever the automation should do —
write to Google Sheets, send a WhatsApp or Telegram message, call an LLM. Keep
`Respond to Webhook` last if the caller expects an answer; drop it (and set the
webhook's response mode to "immediately") for fire-and-forget work, which returns
faster and avoids the caller timing out on a slow workflow.

## 02 — Daily digest on a schedule

`workflows/02-daily-weather-digest.json` · id `n8nfreedigest002`

```
Schedule (08:00 daily) → HTTP Request (Open-Meteo) → Code (format) → HTTP Request (your chat webhook, disabled)
```

The shape of nearly every recurring report: wake up, fetch something, format it,
post it somewhere. Open-Meteo needs no API key. The times follow
`GENERIC_TIMEZONE` from `.env`, so set that before relying on "08:00".

The final node is disabled on purpose. Paste an incoming webhook URL from Slack,
Discord or Google Chat and enable it — the body sends both `content` (Discord's
field) and `text` (Slack's), so either works unchanged.

**Adapting it.** Swap the HTTP Request for your own data source: a database
query, an RSS feed, your app's API, a Google Sheet. Only the Code node's field
names need to change.

## 03 — Uptime monitor with alerting

`workflows/03-uptime-monitor.json` · id `n8nfreeuptime003`

```
Schedule (every 15 min) → Code (target list) → HTTP Request → IF (status >= 400)
                                                                ├─ true  → Code (build alert) → HTTP Request (disabled)
                                                                └─ false → NoOp
```

A replacement for a paid uptime monitor. Edit the array in **Define Targets** to
watch your own URLs.

Two details worth copying into your own workflows:

- The HTTP Request node uses `neverError` with `fullResponse`, so a 500 flows
  down the branch as data instead of failing the run. The `IF` node then decides
  what counts as down.
- **Build Alert** runs in `runOnceForEachItem` mode so that
  `$('Define Targets').item` resolves the *matching* target. That paired-item
  lookup is how you carry context past a node that discards it — an HTTP response
  does not remember which URL produced it.

Keeping this workflow active on Oracle Cloud has a side benefit: the regular CPU
and network activity helps avoid idle-instance reclamation.

## Editing and version control

Exported workflow JSON is diffable, so keeping it in git is worth doing:

```bash
make export                       # writes to backups/<timestamp>/workflows/
cp backups/<timestamp>/workflows/*.json workflows/
./scripts/validate-workflows.py workflows
git add workflows && git commit -m "Update workflows"
```

`validate-workflows.py` catches the failures that are otherwise invisible: a
connection pointing at a renamed node, a workflow with no trigger, duplicate node
names, a node with nothing connected to it, or a file accidentally exported with
`active: true`.

## Writing your own

- Build in the editor, then export. Hand-writing workflow JSON is possible but
  the node parameter schemas are versioned per node (`typeVersion`), and the
  editor always emits a valid combination.
- Each node's `typeVersion` pins its parameter format. Copying a node from an
  older workflow can silently change behaviour — check it renders without a
  "parameter issue" warning after import.
- Credentials are not exported with workflows. Sharing a workflow file is safe;
  the recipient supplies their own credentials.
