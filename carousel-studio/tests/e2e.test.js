/* End to end test: opens index.html in Chrome exactly the way a user would
   (a local file, no server), drives the UI, and validates the real downloads.
   Run with: npm run test:e2e */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const puppeteer = require('puppeteer-core');

const APP_URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/local/bin/google-chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].filter(Boolean);

function chromePath() {
  const found = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No Chrome binary found. Set CHROME_PATH.');
  return found;
}

function pngSize(file) {
  const buffer = fs.readFileSync(file);
  assert.deepEqual([...buffer.subarray(0, 8)], [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], 'PNG signature');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function waitForDownload(dir, pattern, timeout = 30000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const files = fs.readdirSync(dir).filter((name) => pattern.test(name) && !name.endsWith('.crdownload'));
    if (files.length) {
      const file = path.join(dir, files[0]);
      const first = fs.statSync(file).size;
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (first > 0 && fs.statSync(file).size === first) return file;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`No download matching ${pattern} appeared in ${dir}: ${fs.readdirSync(dir).join(', ') || '(empty)'}`);
}

test('carousel studio works end to end in a real browser', async (t) => {
  const downloadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'carousel-dl-'));
  const artifactDir = process.env.CAROUSEL_ARTIFACT_DIR || fs.mkdtempSync(path.join(os.tmpdir(), 'carousel-art-'));
  fs.mkdirSync(artifactDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--force-device-scale-factor=1']
  });

  const problems = [];
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1680, height: 1050 });
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push('console: ' + message.text());
    });
    page.on('pageerror', (error) => problems.push('pageerror: ' + error.message));

    const cdp = await page.createCDPSession();
    await cdp.send('Browser.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadDir,
      eventsEnabled: true
    });

    await page.goto(APP_URL, { waitUntil: 'load' });
    await page.waitForSelector('.carousel-slide canvas');

    await t.test('first run loads a starter carousel and paints every slide', async () => {
      const slideCount = await page.$$eval('.carousel-slide canvas', (nodes) => nodes.length);
      assert.equal(slideCount, 7);

      const painted = await page.evaluate(() => Array.from(document.querySelectorAll('.carousel-slide canvas')).map((canvas) => {
        const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let opaque = 0;
        let unique = new Set();
        for (let i = 0; i < data.length; i += 4 * 997) {
          if (data[i + 3] > 0) opaque++;
          unique.add(data[i] + ',' + data[i + 1] + ',' + data[i + 2]);
        }
        return { width: canvas.width, height: canvas.height, opaque, colours: unique.size };
      }));

      painted.forEach((slide, index) => {
        assert.equal(slide.width, 720, 'preview width');
        assert.equal(slide.height, 900, 'preview height for the 4:5 format');
        assert.ok(slide.opaque > 0, `slide ${index + 1} is not blank`);
        assert.ok(slide.colours > 3, `slide ${index + 1} has text drawn on it (${slide.colours} sampled colours)`);
      });
    });

    await t.test('arrows, dots and drag move the carousel', async () => {
      assert.match(await page.$eval('.carousel-counter', (n) => n.textContent), /Slide 1 of 7/);

      await page.click('.carousel-nav.next');
      await page.waitForFunction(() => document.querySelector('.carousel-counter').textContent.includes('Slide 2 of 7'));
      assert.equal(await page.$eval('.slide-row.is-active .num', (n) => n.textContent), '2');

      await page.click('.carousel-dot:nth-child(5)');
      await page.waitForFunction(() => document.querySelector('.carousel-counter').textContent.includes('Slide 5 of 7'));

      const box = await page.$eval('.carousel-viewport', (node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      });
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, { steps: 12 });
      await page.mouse.up();
      await page.waitForFunction(() => document.querySelector('.carousel-counter').textContent.includes('Slide 6 of 7'));

      await page.click('.carousel-dot:nth-child(1)');
      await page.waitForFunction(() => document.querySelector('.carousel-counter').textContent.includes('Slide 1 of 7'));
    });

    await t.test('editing a slide updates the preview and the slide list', async () => {
      await page.click('#slideHeading', { clickCount: 3 });
      await page.$eval('#slideHeading', (node) => { node.value = ''; });
      await page.type('#slideHeading', 'Edited hook for the test');
      await page.waitForFunction(() => document.querySelector('.slide-row.is-active .title').textContent === 'Edited hook for the test');

      const heading = await page.evaluate(() => window.carouselStudio.getProject().slides[0].heading);
      assert.equal(heading, 'Edited hook for the test');
    });

    await t.test('every format and theme renders without throwing', async () => {
      const results = await page.evaluate(() => {
        const out = [];
        const project = window.carouselStudio.getProject();
        const originalFormat = project.formatId;
        const originalTheme = project.themeId;
        CS.FORMATS.forEach((format) => {
          CS.THEMES.forEach((theme) => {
            project.formatId = format.id;
            project.themeId = theme.id;
            const canvas = window.carouselStudio.renderSlide(0);
            const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
            let opaque = 0;
            for (let i = 3; i < data.length; i += 4 * 1499) if (data[i] > 0) opaque++;
            out.push({ format: format.id, theme: theme.id, w: canvas.width, h: canvas.height, opaque });
          });
        });
        project.formatId = originalFormat;
        project.themeId = originalTheme;
        return out;
      });
      assert.equal(results.length, 32);
      results.forEach((result) => {
        assert.ok(result.opaque > 0, `${result.format}/${result.theme} rendered pixels`);
        assert.ok(result.w >= 1080 && result.h >= 900, `${result.format} exports at full size`);
      });
    });

    await t.test('outline importer builds slides from pasted text', async () => {
      await page.click('#outlineExample');
      await page.click('#applyOutline');
      await page.waitForFunction(() => document.querySelectorAll('.slide-row').length === 3);
      const layouts = await page.evaluate(() => window.carouselStudio.getProject().slides.map((s) => s.layout));
      assert.deepEqual(layouts, ['cover', 'bullets', 'cta']);
    });

    await t.test('a ZIP of PNGs downloads and passes a CRC check', async () => {
      await page.evaluate(() => {
        const project = window.carouselStudio.getProject();
        project.name = 'E2E export check';
        project.caption = 'Caption written by the end to end test.';
      });
      await page.click('#exportZip');
      const zipPath = await waitForDownload(downloadDir, /\.zip$/);

      const verify = execFileSync('unzip', ['-t', zipPath], { encoding: 'utf8' });
      assert.match(verify, /No errors detected/);

      const listing = execFileSync('unzip', ['-l', zipPath], { encoding: 'utf8' });
      assert.match(listing, /01-.*\.png/);
      assert.match(listing, /caption\.txt/);
      assert.match(listing, /project\.json/);

      const extractDir = path.join(downloadDir, 'unzipped');
      execFileSync('unzip', ['-o', '-q', zipPath, '-d', extractDir]);
      const pngs = fs.readdirSync(extractDir).filter((name) => name.endsWith('.png')).sort();
      assert.equal(pngs.length, 3);
      pngs.forEach((name) => {
        assert.deepEqual(pngSize(path.join(extractDir, name)), { width: 1080, height: 1350 }, name + ' is 1080x1350');
      });
      assert.equal(
        fs.readFileSync(path.join(extractDir, 'caption.txt'), 'utf8'),
        'Caption written by the end to end test.'
      );
      fs.copyFileSync(path.join(extractDir, pngs[0]), path.join(artifactDir, 'export_slide_1.png'));
      fs.copyFileSync(path.join(extractDir, pngs[1]), path.join(artifactDir, 'export_slide_2.png'));
    });

    await t.test('a single slide PNG downloads at full size', async () => {
      await page.click('#exportPng');
      const pngPath = await waitForDownload(downloadDir, /^e2e-export-check-01.*\.png$/);
      assert.deepEqual(pngSize(pngPath), { width: 1080, height: 1350 });
    });

    await t.test('a PDF downloads and poppler can read every page', async () => {
      await page.click('#exportPdf');
      const pdfPath = await waitForDownload(downloadDir, /\.pdf$/);

      const info = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' });
      assert.match(info, /Pages:\s+3/);
      assert.match(info, /Page size:\s+518\.4 x 648 pts/);

      // Rasterising proves the embedded JPEG streams really decode.
      const stem = path.join(downloadDir, 'pdf-page');
      execFileSync('pdftoppm', ['-png', '-r', '72', pdfPath, stem]);
      const rendered = fs.readdirSync(downloadDir).filter((name) => name.startsWith('pdf-page')).sort();
      assert.equal(rendered.length, 3);
      const firstPage = pngSize(path.join(downloadDir, rendered[0]));
      assert.ok(firstPage.width > 400 && firstPage.height > 500, 'page 1 rasterised: ' + JSON.stringify(firstPage));
      fs.copyFileSync(path.join(downloadDir, rendered[0]), path.join(artifactDir, 'pdf_page_1_rasterised.png'));
      fs.copyFileSync(pdfPath, path.join(artifactDir, 'carousel_export.pdf'));
    });

    await t.test('the project file round trips', async () => {
      await page.click('#saveJson');
      const jsonPath = await waitForDownload(downloadDir, /\.json$/);
      const saved = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      assert.equal(saved.slides.length, 3);
      assert.equal(saved.caption, 'Caption written by the end to end test.');

      const uploaded = await page.$('#openJson');
      await page.evaluate(() => window.carouselStudio.setProject({ name: 'Wiped', slides: [{ layout: 'text', heading: 'wiped' }] }));
      await page.waitForFunction(() => document.querySelectorAll('.slide-row').length === 1);
      await uploaded.uploadFile(jsonPath);
      await page.waitForFunction(() => document.querySelectorAll('.slide-row').length === 3);
      const name = await page.evaluate(() => window.carouselStudio.getProject().name);
      assert.equal(name, 'E2E export check');
    });

    await t.test('the browser reported no errors', () => {
      assert.deepEqual(problems, []);
    });
  } finally {
    await browser.close();
  }
});
