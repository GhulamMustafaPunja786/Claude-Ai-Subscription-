const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { parseTypeformPayload, buildWhatsAppBody } = require("../scripts/parse-typeform");

const root = path.join(__dirname, "..");

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function testParser() {
  const sample = loadJson("samples/typeform-webhook.json");
  const parsed = parseTypeformPayload(sample, { WHATSAPP_NOTIFY_TO: "+92 321 5556677" });

  assert.equal(parsed.name, "Ayesha Khan");
  assert.equal(parsed.email, "ayesha@example.com");
  assert.equal(parsed.phone, "923001234567");
  assert.equal(parsed.notifyTo, "923215556677");
  assert.equal(parsed.shouldSend, true);
  assert.match(parsed.message, /Ayesha Khan/);
  assert.match(parsed.message, /ayesha@example.com/);
  assert.match(parsed.summary, /WhatsApp phone/);

  const nested = parseTypeformPayload({ body: sample }, { WHATSAPP_NOTIFY_TO: "" });
  assert.equal(nested.shouldSend, false);
  assert.equal(nested.name, "Ayesha Khan");

  const wa = buildWhatsAppBody(parsed, "123456789");
  assert.equal(wa.url, "https://graph.facebook.com/v21.0/123456789/messages");
  assert.equal(wa.body.to, "923215556677");
  assert.equal(wa.body.messaging_product, "whatsapp");
  assert.equal(wa.body.type, "text");
}

function assertWorkflow(rel, expectedPath) {
  const workflow = loadJson(rel);
  assert.ok(workflow.name, `${rel} missing name`);
  assert.ok(Array.isArray(workflow.nodes) && workflow.nodes.length > 0, `${rel} has no nodes`);
  assert.ok(workflow.connections, `${rel} missing connections`);

  const webhook = workflow.nodes.find((node) => node.type === "n8n-nodes-base.webhook");
  assert.ok(webhook, `${rel} needs a webhook trigger`);
  assert.equal(webhook.parameters.path, expectedPath);

  const nodeNames = new Set(workflow.nodes.map((node) => node.name));
  for (const [source, outputs] of Object.entries(workflow.connections)) {
    assert.ok(nodeNames.has(source), `${rel} connection from unknown node ${source}`);
    for (const branch of outputs.main || []) {
      for (const link of branch) {
        assert.ok(nodeNames.has(link.node), `${rel} connection to unknown node ${link.node}`);
      }
    }
  }
}

function testWorkflows() {
  assertWorkflow("workflows/typeform-to-whatsapp.json", "typeform-lead");
  assertWorkflow("workflows/keep-n8n-awake.json", "ping");

  const typeform = loadJson("workflows/typeform-to-whatsapp.json");
  const http = typeform.nodes.find((node) => node.type === "n8n-nodes-base.httpRequest");
  assert.ok(http, "WhatsApp HTTP node missing");
  assert.match(http.parameters.url, /graph\.facebook\.com/);
  assert.match(http.parameters.jsonBody, /messaging_product/);
}

function testDockerfiles() {
  const dockerfile = fs.readFileSync(path.join(root, "Dockerfile"), "utf8");
  assert.match(dockerfile, /N8N_PORT=7860/);
  assert.match(dockerfile, /EXPOSE 7860/);
  assert.match(dockerfile, /n8nio\/n8n:2\.36\.3/);

  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  assert.match(readme, /^---\n[\s\S]*sdk: docker[\s\S]*app_port: 7860[\s\S]*---/m);

  const compose = fs.readFileSync(path.join(root, "docker-compose.yml"), "utf8");
  assert.match(compose, /n8n_data:\/home\/node\/\.n8n/);
}

testParser();
testWorkflows();
testDockerfiles();
console.log("All n8n free-hosting checks passed.");
