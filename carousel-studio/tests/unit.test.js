/* Unit tests for the two hand written binary writers.
   Run with: npm run test:unit */
const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const zlib = require('node:zlib');

const { createZip, crc32 } = require('../js/zip.js');
const { createPdf } = require('../js/pdf.js');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'carousel-unit-'));

test('crc32 matches zlib', () => {
  const samples = ['', 'a', 'hello world', 'The quick brown fox jumps over the lazy dog'];
  for (const sample of samples) {
    const bytes = Buffer.from(sample, 'utf8');
    assert.equal(crc32(bytes), zlib.crc32(bytes), `crc mismatch for "${sample}"`);
  }
});

test('createZip produces an archive the system unzip can read', () => {
  const binary = new Uint8Array(5000);
  for (let i = 0; i < binary.length; i++) binary[i] = (i * 37) % 256;

  const zip = createZip([
    { name: '01-cover.png', data: binary },
    { name: 'caption.txt', data: 'Line one\nLine two with an accent: café\n' },
    { name: 'project.json', data: JSON.stringify({ slides: 3 }) }
  ]);

  const zipPath = path.join(tmp, 'test.zip');
  fs.writeFileSync(zipPath, Buffer.from(zip));

  const listing = execFileSync('unzip', ['-l', zipPath], { encoding: 'utf8' });
  assert.match(listing, /01-cover\.png/);
  assert.match(listing, /caption\.txt/);
  assert.match(listing, /project\.json/);

  // -t verifies every stored CRC, which is where a hand rolled writer usually breaks.
  const verify = execFileSync('unzip', ['-t', zipPath], { encoding: 'utf8' });
  assert.match(verify, /No errors detected/);

  const outDir = path.join(tmp, 'extracted');
  execFileSync('unzip', ['-o', '-q', zipPath, '-d', outDir]);
  assert.deepEqual(new Uint8Array(fs.readFileSync(path.join(outDir, '01-cover.png'))), binary);
  assert.equal(fs.readFileSync(path.join(outDir, 'caption.txt'), 'utf8'), 'Line one\nLine two with an accent: café\n');
});

test('createZip handles an empty file list', () => {
  // An archive with no entries is just the end-of-central-directory record.
  const zip = Buffer.from(createZip([]));
  assert.equal(zip.length, 22);
  assert.equal(zip.readUInt32LE(0), 0x06054B50);
  assert.equal(zip.readUInt16LE(8), 0, 'no entries on this disk');
  assert.equal(zip.readUInt16LE(10), 0, 'no entries in total');
});

test('createPdf writes a structurally valid xref table', () => {
  // The bytes do not have to decode as an image for the cross reference table to
  // be checkable: every offset must land exactly on its own "N 0 obj" header.
  const fakeJpeg = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 1, 2, 3, 4, 0xFF, 0xD9]);
  const pdf = createPdf([
    { jpeg: fakeJpeg, width: 1080, height: 1350 },
    { jpeg: fakeJpeg, width: 1080, height: 1350 }
  ], { title: 'Structure check', dpi: 150 });

  const buffer = Buffer.from(pdf);
  const text = buffer.toString('latin1');

  assert.ok(text.startsWith('%PDF-1.4\n'), 'starts with a PDF header');
  assert.ok(text.trimEnd().endsWith('%%EOF'), 'ends with %%EOF');
  assert.match(text, /\/Type \/Pages \/Count 2/);
  assert.equal((text.match(/\/Subtype \/Image/g) || []).length, 2);
  assert.match(text, /\/MediaBox \[0 0 518\.4 648\]/);

  const startxref = Number(text.match(/startxref\n(\d+)/)[1]);
  assert.equal(text.slice(startxref, startxref + 4), 'xref');

  const size = Number(text.match(/\/Size (\d+)/)[1]);
  assert.equal(size, 3 + 2 * 3 + 1);

  const entries = text.slice(startxref).match(/^(\d{10}) 00000 n $/gm);
  assert.equal(entries.length, size - 1);
  entries.forEach((entry, i) => {
    const offset = Number(entry.slice(0, 10));
    assert.equal(text.slice(offset, offset + `${i + 1} 0 obj`.length), `${i + 1} 0 obj`,
      `object ${i + 1} offset points at the wrong place`);
  });
});

test('createPdf maps pixels to points at the requested dpi', () => {
  const fakeJpeg = new Uint8Array([0xFF, 0xD8, 0xFF, 0xD9]);
  const pdf = Buffer.from(createPdf([{ jpeg: fakeJpeg, width: 1200, height: 900 }], { dpi: 72 }));
  assert.match(pdf.toString('latin1'), /\/MediaBox \[0 0 1200 900\]/);
});
