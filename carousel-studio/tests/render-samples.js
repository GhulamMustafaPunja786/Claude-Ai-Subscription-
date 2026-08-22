/* Renders one sample slide per layout plus a full app screenshot, so the design
   can be eyeballed after a change to the renderer.
   Usage: node tests/render-samples.js [outputDir] */
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const OUT = process.argv[2] || path.join(require('node:os').tmpdir(), 'carousel-samples');
const APP_URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
const CHROME = [process.env.CHROME_PATH, '/usr/local/bin/google-chrome', '/usr/bin/google-chrome', '/usr/bin/chromium']
  .filter(Boolean)
  .find((candidate) => fs.existsSync(candidate));

const SAMPLE = {
  name: 'Layout sampler',
  formatId: 'portrait',
  themeId: 'midnight',
  fontId: 'sans',
  background: 'glow',
  brand: { handle: '@liftthecity', ctaText: 'Follow for more', showPageNumbers: true, showSwipeHint: true, showHandle: true, logoDataUrl: '' },
  caption: 'sampler',
  slides: [
    { layout: 'cover', eyebrow: 'Nutrition', heading: '5 protein mistakes killing your results', body: 'Most people get three of these wrong. Number four is the expensive one.' },
    { layout: 'text', eyebrow: 'Mistake 1', heading: 'You save all your protein for dinner', body: 'Your body uses protein best in 25-40 g doses spread across the day. One giant meal wastes most of it.' },
    { layout: 'bullets', eyebrow: 'Quick list', heading: 'What we are fixing today', body: 'Timing your intake badly\nToo little protein per meal\nOnly ever using one source\nPaying for filler blends' },
    { layout: 'quote', heading: 'Cheap protein is only cheap until you read the label.', body: 'Every gram of filler is a gram you paid for' },
    { layout: 'stat', eyebrow: 'The number', heading: '1.6 g', body: 'Protein per kilo of bodyweight is the sweet spot for building muscle in most training people.' },
    { layout: 'cta', eyebrow: 'Your turn', heading: 'Which mistake were you making?', body: 'Tell me in the comments and save this for your next shop.' }
  ]
};

(async () => {
  if (!CHROME) throw new Error('No Chrome binary found. Set CHROME_PATH.');
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--force-device-scale-factor=1']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1680, height: 1080 });
  page.on('pageerror', (error) => { throw error; });
  await page.goto(APP_URL, { waitUntil: 'load' });
  await page.waitForSelector('.carousel-slide canvas');

  await page.evaluate((sample) => window.carouselStudio.setProject(sample), SAMPLE);
  await page.waitForFunction((count) => document.querySelectorAll('.slide-row').length === count, {}, SAMPLE.slides.length);

  const images = await page.evaluate((count) => {
    const out = [];
    for (let i = 0; i < count; i++) {
      const canvas = window.carouselStudio.renderSlide(i, 720, 900);
      out.push(canvas.toDataURL('image/png'));
    }
    return out;
  }, SAMPLE.slides.length);

  images.forEach((dataUrl, i) => {
    const file = path.join(OUT, `layout_${i + 1}_${SAMPLE.slides[i].layout}.png`);
    fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('wrote', file);
  });

  const shot = path.join(OUT, 'app_window.png');
  await page.screenshot({ path: shot });
  console.log('wrote', shot);

  await browser.close();
})();
