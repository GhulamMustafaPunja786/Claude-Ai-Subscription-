/* Minimal PDF writer: one full-bleed JPEG per page.
   JPEG data is passed straight through with /DCTDecode, so no image codec or
   compression library is needed - this keeps the whole tool dependency free.
   A PDF is what LinkedIn expects when you post a document carousel. */
(function (global) {
  var DEFAULT_DPI = 150;

  function latin1(text) {
    var out = new Uint8Array(text.length);
    for (var i = 0; i < text.length; i++) out[i] = text.charCodeAt(i) & 0xFF;
    return out;
  }

  function pad10(number) {
    var text = String(number);
    while (text.length < 10) text = '0' + text;
    return text;
  }

  function pdfDate(date) {
    function two(n) { return (n < 10 ? '0' : '') + n; }
    return 'D:' + date.getUTCFullYear() + two(date.getUTCMonth() + 1) + two(date.getUTCDate()) +
      two(date.getUTCHours()) + two(date.getUTCMinutes()) + two(date.getUTCSeconds()) + 'Z';
  }

  function escapeText(text) {
    return String(text || '').replace(/([\\()])/g, '\\$1').replace(/[\r\n]+/g, ' ');
  }

  /* pages: [{ jpeg: Uint8Array, width: px, height: px }] -> Uint8Array */
  function createPdf(pages, options) {
    var opts = options || {};
    var dpi = opts.dpi || DEFAULT_DPI;
    var title = opts.title || 'Carousel';
    var now = opts.date || new Date();

    var chunks = [];
    var length = 0;
    var offsets = [];

    function write(bytes) {
      chunks.push(bytes);
      length += bytes.length;
    }
    function writeText(text) { write(latin1(text)); }
    function beginObject(id) {
      offsets[id] = length;
      writeText(id + ' 0 obj\n');
    }
    function endObject() { writeText('endobj\n'); }

    var pageCount = pages.length;
    var firstPageObject = 4; // 1 catalog, 2 pages, 3 info
    var objectCount = 3 + pageCount * 3;

    writeText('%PDF-1.4\n');
    write(new Uint8Array([0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A])); // binary marker

    beginObject(1);
    writeText('<< /Type /Catalog /Pages 2 0 R >>\n');
    endObject();

    var kids = pages.map(function (page, i) { return (firstPageObject + i * 3) + ' 0 R'; }).join(' ');
    beginObject(2);
    writeText('<< /Type /Pages /Count ' + pageCount + ' /Kids [' + kids + '] >>\n');
    endObject();

    beginObject(3);
    writeText('<< /Title (' + escapeText(title) + ') /Producer (Carousel Studio) /CreationDate (' + pdfDate(now) + ') >>\n');
    endObject();

    pages.forEach(function (page, i) {
      var pageId = firstPageObject + i * 3;
      var contentId = pageId + 1;
      var imageId = pageId + 2;
      var widthPt = round2(page.width * 72 / dpi);
      var heightPt = round2(page.height * 72 / dpi);

      beginObject(pageId);
      writeText('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + widthPt + ' ' + heightPt + ']' +
        ' /Resources << /XObject << /Im0 ' + imageId + ' 0 R >> >> /Contents ' + contentId + ' 0 R >>\n');
      endObject();

      var content = 'q\n' + widthPt + ' 0 0 ' + heightPt + ' 0 0 cm\n/Im0 Do\nQ\n';
      beginObject(contentId);
      writeText('<< /Length ' + content.length + ' >>\nstream\n');
      writeText(content);
      writeText('endstream\n');
      endObject();

      beginObject(imageId);
      writeText('<< /Type /XObject /Subtype /Image /Width ' + page.width + ' /Height ' + page.height +
        ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + page.jpeg.length + ' >>\nstream\n');
      write(page.jpeg);
      writeText('\nendstream\n');
      endObject();
    });

    var xrefOffset = length;
    writeText('xref\n0 ' + (objectCount + 1) + '\n');
    writeText('0000000000 65535 f \n');
    for (var id = 1; id <= objectCount; id++) {
      writeText(pad10(offsets[id] || 0) + ' 00000 n \n');
    }
    writeText('trailer\n<< /Size ' + (objectCount + 1) + ' /Root 1 0 R /Info 3 0 R >>\n');
    writeText('startxref\n' + xrefOffset + '\n%%EOF\n');

    var out = new Uint8Array(length);
    var offset = 0;
    chunks.forEach(function (chunk) {
      out.set(chunk, offset);
      offset += chunk.length;
    });
    return out;
  }

  function round2(value) {
    return Math.round(value * 100) / 100;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createPdf: createPdf };
  } else {
    global.CS = global.CS || {};
    global.CS.createPdf = createPdf;
  }
})(typeof window !== 'undefined' ? window : globalThis);
