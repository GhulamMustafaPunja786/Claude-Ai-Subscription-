/* Minimal ZIP writer (stored / no compression).
   Written from scratch so the tool needs no CDN, no npm install and no network. */
(function (global) {
  var crcTable = null;

  function makeCrcTable() {
    var table = new Int32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  }

  function crc32(bytes) {
    if (!crcTable) crcTable = makeCrcTable();
    var crc = -1;
    for (var i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ -1) >>> 0;
  }

  function utf8(text) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text);
    var out = [];
    for (var i = 0; i < text.length; i++) {
      var code = text.charCodeAt(i);
      if (code < 128) out.push(code);
      else if (code < 2048) out.push(192 | (code >> 6), 128 | (code & 63));
      else out.push(224 | (code >> 12), 128 | ((code >> 6) & 63), 128 | (code & 63));
    }
    return new Uint8Array(out);
  }

  function dosDateTime(date) {
    var year = Math.max(1980, date.getFullYear());
    return {
      time: (date.getHours() << 11) | (date.getMinutes() << 5) | (Math.floor(date.getSeconds() / 2)),
      date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
    };
  }

  function Writer() {
    this.chunks = [];
    this.length = 0;
  }
  Writer.prototype.push = function (bytes) {
    this.chunks.push(bytes);
    this.length += bytes.length;
  };
  Writer.prototype.u16 = function (value) {
    this.push(new Uint8Array([value & 0xFF, (value >>> 8) & 0xFF]));
  };
  Writer.prototype.u32 = function (value) {
    this.push(new Uint8Array([value & 0xFF, (value >>> 8) & 0xFF, (value >>> 16) & 0xFF, (value >>> 24) & 0xFF]));
  };
  Writer.prototype.merge = function () {
    var out = new Uint8Array(this.length);
    var offset = 0;
    this.chunks.forEach(function (chunk) {
      out.set(chunk, offset);
      offset += chunk.length;
    });
    return out;
  };

  /* files: [{ name: string, data: Uint8Array | string }] -> Uint8Array */
  function createZip(files, now) {
    var stamp = dosDateTime(now || new Date());
    var writer = new Writer();
    var entries = [];

    files.forEach(function (file) {
      var name = utf8(file.name);
      var data = typeof file.data === 'string' ? utf8(file.data) : file.data;
      var crc = crc32(data);
      var offset = writer.length;

      writer.u32(0x04034B50);
      writer.u16(20);
      writer.u16(0x0800); // UTF-8 file names
      writer.u16(0);      // stored
      writer.u16(stamp.time);
      writer.u16(stamp.date);
      writer.u32(crc);
      writer.u32(data.length);
      writer.u32(data.length);
      writer.u16(name.length);
      writer.u16(0);
      writer.push(name);
      writer.push(data);

      entries.push({ name: name, crc: crc, size: data.length, offset: offset });
    });

    var centralStart = writer.length;
    entries.forEach(function (entry) {
      writer.u32(0x02014B50);
      writer.u16(20);
      writer.u16(20);
      writer.u16(0x0800);
      writer.u16(0);
      writer.u16(stamp.time);
      writer.u16(stamp.date);
      writer.u32(entry.crc);
      writer.u32(entry.size);
      writer.u32(entry.size);
      writer.u16(entry.name.length);
      writer.u16(0);
      writer.u16(0);
      writer.u16(0);
      writer.u16(0);
      writer.u32(0);
      writer.u32(entry.offset);
      writer.push(entry.name);
    });

    var centralSize = writer.length - centralStart;
    writer.u32(0x06054B50);
    writer.u16(0);
    writer.u16(0);
    writer.u16(entries.length);
    writer.u16(entries.length);
    writer.u32(centralSize);
    writer.u32(centralStart);
    writer.u16(0);

    return writer.merge();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createZip: createZip, crc32: crc32 };
  } else {
    global.CS = global.CS || {};
    global.CS.createZip = createZip;
    global.CS.crc32 = crc32;
  }
})(typeof window !== 'undefined' ? window : globalThis);
