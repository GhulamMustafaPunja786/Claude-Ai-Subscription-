# Typeform → WhatsApp (completely free APIs)

The workflow `workflows/typeform-to-whatsapp.json` is a webhook that:

1. Receives a Typeform submission
2. Pulls name, email, phone, and the other answers
3. Sends **you** a WhatsApp Cloud API text alert

It does **not** message the form submitter by default. Meta only allows free-form text inside an existing 24-hour customer-care window; outbound “thanks for submitting” notes need an approved template.

## Free limits

| Service | Free piece |
| --- | --- |
| n8n Community Edition | Unlimited executions when self-hosted |
| Typeform | Free plan, limited responses / month |
| WhatsApp Cloud API | 1,000 service conversations / month on the official API |
| Hugging Face Spaces | Free CPU Docker Space |
| Supabase | Free Postgres |

## 1. Meta WhatsApp Cloud API

1. Go to [developers.facebook.com](https://developers.facebook.com) and create an app with the **WhatsApp** product.
2. On **API setup**, copy:
   - Phone number ID → `WHATSAPP_PHONE_NUMBER_ID`
   - Temporary access token, or generate a permanent system-user token → `WHATSAPP_ACCESS_TOKEN`
3. Add **your** WhatsApp number as a test recipient (the number in `WHATSAPP_NOTIFY_TO`).
4. Send the Meta “hello world” template once from the dashboard so the test number is confirmed.

Digits-only destination, with country code, no plus: Pakistan example `923001234567`.

## 2. Typeform webhook

1. Open the form → **Connect** → **Webhooks** → Add.
2. URL (after the workflow is **Active**):

   `https://YOUR-N8N-HOST/webhook/typeform-lead`

   Hugging Face example:

   `https://YOURUSER-YOURSPACE.hf.space/webhook/typeform-lead`
3. Send a test delivery from Typeform, or:

```bash
curl -X POST "http://localhost:5678/webhook-test/typeform-lead" \
  -H "Content-Type: application/json" \
  -d @samples/typeform-webhook.json
```

Use `/webhook/typeform-lead` (no `-test`) once the workflow is switched on.

## 3. Import into n8n

Editor → **⋯** menu → **Import from file** → `workflows/typeform-to-whatsapp.json` → **Save** → toggle **Active**.

If WhatsApp env vars are missing, the workflow still stores the parsed lead and skips the send (see the **Skip Send** node). That is useful while you only test Typeform.

## 4. Production note about templates

When you later want to WhatsApp the **lead** instead of yourself, create a template in Meta Business Manager (for example `lead_thanks`) and change the HTTP body `type` from `text` to `template`. Until that template is approved, keep alerting your own number.
