import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "c1-option-b", "index.html");
const exportDir = path.join(root, "c1-option-b", "export");

fs.mkdirSync(exportDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1350 },
  deviceScaleFactor: 1,
});

await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

for (let i = 1; i <= 6; i++) {
  const slide = page.locator(`#slide-${i}`);
  await slide.scrollIntoViewIfNeeded();
  const out = path.join(exportDir, `c1-option-b-slide-${String(i).padStart(2, "0")}.png`);
  await slide.screenshot({ path: out, type: "png" });
  console.log(`Exported ${out}`);
}

await browser.close();
console.log("Done — C1 Option B: 6 slides exported at 1080×1350 px.");
