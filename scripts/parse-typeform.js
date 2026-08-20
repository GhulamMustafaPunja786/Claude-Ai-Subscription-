/**
 * Shared Typeform webhook parser used by the n8n Code node and by tests.
 * Keep this file and workflows/typeform-to-whatsapp.json in sync.
 */
function fieldMeta(fields, id) {
  const field = (fields || []).find((item) => item.id === id) || {};
  return {
    title: String(field.title || "").toLowerCase(),
    ref: String(field.ref || "").toLowerCase(),
    label: field.title || field.ref || id || "field",
  };
}

function answerValue(answer) {
  if (!answer) return "";
  if (answer.type === "email") return answer.email || "";
  if (answer.type === "phone_number") return answer.phone_number || "";
  if (answer.type === "boolean") return answer.boolean ? "Yes" : "No";
  if (answer.type === "number") return String(answer.number ?? "");
  if (answer.type === "choice") return (answer.choice && answer.choice.label) || "";
  if (answer.type === "choices") return ((answer.choices && answer.choices.labels) || []).join(", ");
  if (answer.type === "date") return answer.date || "";
  if (answer.type === "url") return answer.url || "";
  if (answer.file_url) return answer.file_url;
  return answer.text || answer.email || answer.phone_number || "";
}

function digitsOnly(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function parseTypeformPayload(raw, env) {
  const root = raw || {};
  const payload = root.body || root;
  const form = payload.form_response || payload;
  const fields = form.definition?.fields || [];
  const answers = form.answers || [];
  const extracted = {};
  const lines = [];

  for (const answer of answers) {
    const meta = fieldMeta(fields, answer.field && answer.field.id);
    const key = meta.ref || meta.title || (answer.field && answer.field.id) || "field";
    const value = answerValue(answer);
    extracted[key] = value;
    if (value) lines.push(`${meta.label}: ${value}`);

    const haystack = `${meta.title} ${meta.ref}`;
    if (/email/.test(haystack) || answer.type === "email") extracted.email = value;
    if (/phone|whatsapp|mobile|cell/.test(haystack) || answer.type === "phone_number") {
      extracted.phone = value;
    }
    if (/(^| )(name|full name|your name|first name)( |$)/.test(` ${haystack} `)) {
      extracted.name = extracted.name || value;
    }
  }

  const notifyTo = digitsOnly(env && env.WHATSAPP_NOTIFY_TO);
  const name = extracted.name || "someone";
  const summary = lines.join("\n") || "No answers";

  return {
    name,
    email: extracted.email || "",
    phone: digitsOnly(extracted.phone),
    notifyTo,
    submittedAt: form.submitted_at || "",
    formId: form.form_id || "",
    summary,
    message: `New Typeform lead from ${name}\n${summary}`.slice(0, 4000),
    shouldSend: Boolean(notifyTo),
  };
}

function buildWhatsAppBody(parsed, phoneNumberId) {
  return {
    url: `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    body: {
      messaging_product: "whatsapp",
      to: parsed.notifyTo,
      type: "text",
      text: { body: parsed.message, preview_url: false },
    },
  };
}

module.exports = {
  parseTypeformPayload,
  buildWhatsAppBody,
  answerValue,
  digitsOnly,
};
