/* Slide renderer.
   Every slide is composed in a 1080-unit wide design space and the canvas is
   scaled to whatever pixel size the caller asks for, so the on-screen preview
   and the exported file are pixel-for-pixel the same layout. */
window.CS = window.CS || {};

(function () {
  var DESIGN_WIDTH = 1080;
  var PAD = 92;
  var imageCache = {};

  var VERTICAL_WEIGHT = {
    cover: 0.5,
    cta: 0.5,
    quote: 0.5,
    stat: 0.42,
    text: 0.28,
    bullets: 0.22
  };

  CS.preloadImage = function (dataUrl) {
    return new Promise(function (resolve) {
      if (!dataUrl) return resolve(null);
      if (imageCache[dataUrl] && imageCache[dataUrl].complete) return resolve(imageCache[dataUrl]);
      var img = new Image();
      img.onload = function () { imageCache[dataUrl] = img; resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = dataUrl;
    });
  };

  function cachedImage(dataUrl) {
    var img = dataUrl ? imageCache[dataUrl] : null;
    return img && img.complete && img.naturalWidth ? img : null;
  }

  function fontString(font, weight, size, italic) {
    return (italic ? 'italic ' : '') + weight + ' ' + size + 'px ' + font.stack;
  }

  function roundRect(ctx, x, y, w, h, r) {
    var radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  /* Canvas has no text layout engine, so wrapping is done by measuring words. */
  function wrapLines(ctx, text, maxWidth) {
    var lines = [];
    String(text == null ? '' : text).split('\n').forEach(function (paragraph) {
      var words = paragraph.split(/\s+/).filter(function (w) { return w.length; });
      if (!words.length) { lines.push(''); return; }
      var current = words[0];
      for (var i = 1; i < words.length; i++) {
        var candidate = current + ' ' + words[i];
        if (ctx.measureText(candidate).width <= maxWidth) {
          current = candidate;
        } else {
          lines.push(current);
          current = words[i];
        }
      }
      lines.push(current);
    });
    return lines;
  }

  /* Letter-spaced text drawn glyph by glyph: ctx.letterSpacing is not available
     in every browser we want this tool to run in. */
  function trackedWidth(ctx, text, tracking) {
    var width = 0;
    for (var i = 0; i < text.length; i++) {
      width += ctx.measureText(text[i]).width + (i < text.length - 1 ? tracking : 0);
    }
    return width;
  }

  function drawTracked(ctx, text, x, y, tracking) {
    var cursor = x;
    ctx.textAlign = 'left';
    for (var i = 0; i < text.length; i++) {
      ctx.fillText(text[i], cursor, y);
      cursor += ctx.measureText(text[i]).width + tracking;
    }
    return cursor - x;
  }

  function drawBackground(ctx, dw, dh, theme, style) {
    if (style === 'solid') {
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, dw, dh);
      return;
    }
    var gradient = ctx.createLinearGradient(0, 0, dw, dh);
    gradient.addColorStop(0, theme.bg);
    gradient.addColorStop(1, theme.bg2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dw, dh);

    if (style === 'glow') {
      var glow = ctx.createRadialGradient(dw * 0.85, dh * 0.12, 0, dw * 0.85, dh * 0.12, dw * 0.9);
      glow.addColorStop(0, hexToRgba(theme.accent, 0.32));
      glow.addColorStop(1, hexToRgba(theme.accent, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, dw, dh);
    }
    if (style === 'block') {
      ctx.fillStyle = hexToRgba(theme.accent, 0.16);
      roundRect(ctx, -dw * 0.25, -dh * 0.2, dw * 0.85, dh * 0.42, 80);
      ctx.fill();
      ctx.fillStyle = hexToRgba(theme.accent, 0.1);
      roundRect(ctx, dw * 0.55, dh * 0.72, dw * 0.7, dh * 0.4, 80);
      ctx.fill();
    }
  }

  function hexToRgba(hex, alpha) {
    var value = String(hex).replace('#', '');
    if (value.length === 3) value = value.split('').map(function (c) { return c + c; }).join('');
    var num = parseInt(value, 16);
    if (isNaN(num)) return 'rgba(255,255,255,' + alpha + ')';
    return 'rgba(' + ((num >> 16) & 255) + ',' + ((num >> 8) & 255) + ',' + (num & 255) + ',' + alpha + ')';
  }

  function measureBlock(ctx, block, font, maxWidth) {
    if (block.kind === 'gap') return { height: block.height };
    if (block.kind === 'rule') return { height: block.height || 8 };
    if (block.kind === 'quotemark') return { height: block.size * 0.62 };

    if (block.kind === 'pill') {
      ctx.font = fontString(font, 700, block.size);
      return { height: block.size * 2.1 };
    }
    if (block.kind === 'button') {
      ctx.font = fontString(font, 700, block.size);
      return { height: block.size * 2.5 };
    }
    if (block.kind === 'bullets') {
      ctx.font = fontString(font, 500, block.size);
      var total = 0;
      var wrapped = block.items.map(function (item) {
        var lines = wrapLines(ctx, item, maxWidth - block.size * 2.1);
        total += lines.length * block.size * 1.4 + block.size * 0.95;
        return lines;
      });
      block._wrapped = wrapped;
      return { height: Math.max(0, total - block.size * 0.95) };
    }
    ctx.font = fontString(font, block.weight, block.size, block.italic);
    block._lines = wrapLines(ctx, block.text, maxWidth);
    return { height: block._lines.length * block.size * (block.lineHeight || 1.22) };
  }

  function drawBlock(ctx, block, x, y, maxWidth, theme, font) {
    var align = block.align || 'left';
    var originX = align === 'center' ? x + maxWidth / 2 : x;

    if (block.kind === 'gap') return;

    if (block.kind === 'rule') {
      ctx.fillStyle = theme.accent;
      roundRect(ctx, align === 'center' ? originX - block.width / 2 : x, y, block.width, block.height || 8, 8);
      ctx.fill();
      return;
    }

    if (block.kind === 'pill') {
      ctx.font = fontString(font, 700, block.size);
      var label = block.text.toUpperCase();
      var tracking = block.size * 0.14;
      var textWidth = trackedWidth(ctx, label, tracking);
      var padX = block.size * 0.8;
      var pillH = block.size * 1.85;
      var pillX = align === 'center' ? originX - (textWidth + padX * 2) / 2 : x;
      ctx.fillStyle = theme.accent;
      roundRect(ctx, pillX, y, textWidth + padX * 2, pillH, pillH / 2);
      ctx.fill();
      ctx.fillStyle = theme.accentText;
      ctx.textBaseline = 'middle';
      drawTracked(ctx, label, pillX + padX, y + pillH / 2 + block.size * 0.04, tracking);
      ctx.textBaseline = 'alphabetic';
      return;
    }

    if (block.kind === 'button') {
      ctx.font = fontString(font, 700, block.size);
      var btnLabel = block.text;
      var btnTextWidth = ctx.measureText(btnLabel).width;
      var btnPadX = block.size * 1.15;
      var btnH = block.size * 2.1;
      var btnX = align === 'center' ? originX - (btnTextWidth + btnPadX * 2) / 2 : x;
      ctx.fillStyle = theme.accent;
      roundRect(ctx, btnX, y, btnTextWidth + btnPadX * 2, btnH, btnH / 2);
      ctx.fill();
      ctx.fillStyle = theme.accentText;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(btnLabel, btnX + btnPadX, y + btnH / 2 + block.size * 0.04);
      ctx.textBaseline = 'alphabetic';
      return;
    }

    if (block.kind === 'quotemark') {
      ctx.font = 'bold ' + block.size + 'px Georgia, "Times New Roman", serif';
      ctx.fillStyle = hexToRgba(theme.accent, 0.85);
      ctx.textAlign = align === 'center' ? 'center' : 'left';
      ctx.fillText('\u201C', originX, y + block.size * 0.62);
      ctx.textAlign = 'left';
      return;
    }

    if (block.kind === 'bullets') {
      ctx.font = fontString(font, 500, block.size);
      var cursorY = y;
      var wrapped = block._wrapped || block.items.map(function (item) { return [item]; });
      wrapped.forEach(function (lines) {
        var markerSize = block.size * 0.92;
        var markerY = cursorY + block.size * 0.18;
        ctx.fillStyle = hexToRgba(theme.accent, 0.22);
        roundRect(ctx, x, markerY, markerSize, markerSize, markerSize * 0.32);
        ctx.fill();
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = markerSize * 0.14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x + markerSize * 0.26, markerY + markerSize * 0.52);
        ctx.lineTo(x + markerSize * 0.44, markerY + markerSize * 0.7);
        ctx.lineTo(x + markerSize * 0.75, markerY + markerSize * 0.3);
        ctx.stroke();

        ctx.fillStyle = theme.text;
        ctx.font = fontString(font, 500, block.size);
        ctx.textAlign = 'left';
        lines.forEach(function (line, i) {
          ctx.fillText(line, x + block.size * 2.1, cursorY + block.size * (i * 1.4 + 1));
        });
        cursorY += lines.length * block.size * 1.4 + block.size * 0.95;
      });
      return;
    }

    ctx.font = fontString(font, block.weight, block.size, block.italic);
    ctx.fillStyle = block.color || theme.text;
    ctx.textAlign = align;
    var lineHeight = block.size * (block.lineHeight || 1.22);
    (block._lines || [block.text]).forEach(function (line, i) {
      ctx.fillText(line, originX, y + lineHeight * i + block.size * 0.86);
    });
    ctx.textAlign = 'left';
  }

  function bodyLines(text) {
    return String(text || '')
      .split('\n')
      .map(function (line) { return line.replace(/^\s*[-*\u2022]\s?/, '').trim(); })
      .filter(function (line) { return line.length; });
  }

  /* Builds the vertical stack of blocks for a slide at a candidate heading size.
     The caller shrinks headingSize until the stack fits the content box. */
  function buildBlocks(slide, project, theme, headingSize, scaleHint) {
    var blocks = [];
    var layout = slide.layout;
    var heading = slide.heading || '';
    var body = slide.body || '';
    var eyebrow = slide.eyebrow || '';
    var s = scaleHint;

    if (layout === 'quote') {
      blocks.push({ kind: 'quotemark', size: 190 * s });
      blocks.push({ kind: 'gap', height: 18 * s });
      blocks.push({ kind: 'text', text: heading, size: headingSize, weight: 500, italic: true, lineHeight: 1.3 });
      if (body) {
        blocks.push({ kind: 'gap', height: 34 * s });
        blocks.push({ kind: 'rule', width: 110 * s, height: 8 * s });
        blocks.push({ kind: 'gap', height: 30 * s });
        blocks.push({ kind: 'text', text: body, size: 38 * s, weight: 600, color: theme.muted, lineHeight: 1.4 });
      }
      return blocks;
    }

    if (layout === 'stat') {
      if (eyebrow) {
        blocks.push({ kind: 'pill', size: 27 * s, text: eyebrow });
        blocks.push({ kind: 'gap', height: 40 * s });
      }
      blocks.push({ kind: 'text', text: heading, size: headingSize * 1.9, weight: 800, color: theme.accent, lineHeight: 1.06 });
      if (body) {
        /* Big numbers have deep descenders, so the gap is generous on purpose. */
        blocks.push({ kind: 'gap', height: 62 * s });
        blocks.push({ kind: 'text', text: body, size: 42 * s, weight: 500, color: theme.text, lineHeight: 1.42 });
      }
      return blocks;
    }

    if (layout === 'cta') {
      if (eyebrow) {
        blocks.push({ kind: 'pill', size: 27 * s, text: eyebrow, align: 'center' });
        blocks.push({ kind: 'gap', height: 44 * s });
      }
      blocks.push({ kind: 'text', text: heading, size: headingSize, weight: 800, lineHeight: 1.12, align: 'center' });
      if (body) {
        blocks.push({ kind: 'gap', height: 30 * s });
        blocks.push({ kind: 'text', text: body, size: 40 * s, weight: 500, color: theme.muted, lineHeight: 1.45, align: 'center' });
      }
      if (project.brand.ctaText) {
        blocks.push({ kind: 'gap', height: 54 * s });
        blocks.push({ kind: 'button', size: 36 * s, text: project.brand.ctaText, align: 'center' });
      }
      return blocks;
    }

    if (eyebrow) {
      blocks.push({ kind: 'pill', size: 27 * s, text: eyebrow });
      blocks.push({ kind: 'gap', height: layout === 'cover' ? 46 * s : 40 * s });
    }
    blocks.push({
      kind: 'text',
      text: heading,
      size: headingSize,
      weight: layout === 'cover' ? 800 : 700,
      lineHeight: 1.1
    });

    if (layout === 'bullets') {
      var items = bodyLines(body);
      if (items.length) {
        /* Fewer lines get bigger type so a short list still fills the slide. */
        var bulletSize = (items.length <= 3 ? 46 : items.length <= 5 ? 42 : 37) * s;
        blocks.push({ kind: 'gap', height: 58 * s });
        blocks.push({ kind: 'bullets', size: bulletSize, items: items });
      }
    } else if (body) {
      blocks.push({ kind: 'gap', height: layout === 'cover' ? 36 * s : 32 * s });
      blocks.push({
        kind: 'text',
        text: body,
        size: (layout === 'cover' ? 42 : 40) * s,
        weight: 500,
        color: theme.muted,
        lineHeight: 1.45
      });
    }
    return blocks;
  }

  function drawFooter(ctx, dw, dh, slide, project, theme, font, index, total, s) {
    var brand = project.brand;
    var baseY = dh - PAD * s * 0.75;
    var logo = cachedImage(brand.logoDataUrl);
    var handleX = PAD * s;

    if (project.slides.length > 1) {
      var barW = dw - PAD * s * 2;
      var barY = baseY - 54 * s;
      ctx.fillStyle = hexToRgba(theme.text, 0.14);
      roundRect(ctx, handleX, barY, barW, 6 * s, 3 * s);
      ctx.fill();
      ctx.fillStyle = theme.accent;
      roundRect(ctx, handleX, barY, Math.max(barW * ((index + 1) / total), 24 * s), 6 * s, 3 * s);
      ctx.fill();
    }

    if (logo) {
      var logoSize = 46 * s;
      var ratio = logo.naturalWidth / logo.naturalHeight;
      ctx.drawImage(logo, handleX, baseY - logoSize * 0.78, logoSize * ratio, logoSize);
      handleX += logoSize * ratio + 18 * s;
    }

    if (brand.showHandle && brand.handle) {
      ctx.font = fontString(font, 600, 30 * s);
      ctx.fillStyle = hexToRgba(theme.text, 0.72);
      ctx.textAlign = 'left';
      ctx.fillText(brand.handle, handleX, baseY);
    }

    if (brand.showPageNumbers && total > 1) {
      ctx.font = fontString(font, 600, 30 * s);
      ctx.fillStyle = hexToRgba(theme.text, 0.55);
      ctx.textAlign = 'right';
      ctx.fillText((index + 1) + ' / ' + total, dw - PAD * s, baseY);
      ctx.textAlign = 'left';
    }

    var isLast = index === total - 1;
    if (brand.showSwipeHint && total > 1 && !isLast) {
      var cx = dw - PAD * s - 34 * s;
      var cy = baseY - 118 * s;
      ctx.fillStyle = theme.accent;
      ctx.beginPath();
      ctx.arc(cx, cy, 40 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = theme.accentText;
      ctx.lineWidth = 6 * s;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 12 * s, cy);
      ctx.lineTo(cx + 12 * s, cy);
      ctx.moveTo(cx + 2 * s, cy - 11 * s);
      ctx.lineTo(cx + 13 * s, cy);
      ctx.lineTo(cx + 2 * s, cy + 11 * s);
      ctx.stroke();

      ctx.font = fontString(font, 700, 26 * s);
      ctx.fillStyle = hexToRgba(theme.text, 0.6);
      drawTrackedRight(ctx, 'SWIPE', cx - 62 * s, cy + 9 * s, 26 * s * 0.16);
    }
  }

  function drawTrackedRight(ctx, text, right, y, tracking) {
    var width = trackedWidth(ctx, text, tracking);
    drawTracked(ctx, text, right - width, y, tracking);
  }

  function headingRange(layout, s) {
    if (layout === 'cover') return { max: 108 * s, min: 52 * s };
    if (layout === 'quote') return { max: 76 * s, min: 40 * s };
    if (layout === 'stat') return { max: 132 * s, min: 60 * s };
    if (layout === 'cta') return { max: 86 * s, min: 44 * s };
    if (layout === 'bullets') return { max: 68 * s, min: 38 * s };
    return { max: 78 * s, min: 40 * s };
  }

  CS.renderSlide = function (ctx, options) {
    var project = options.project;
    var slide = options.slide;
    var index = options.index || 0;
    var total = options.total || project.slides.length;
    var width = options.width;
    var height = options.height;
    var theme = CS.findTheme(project.themeId);
    var font = CS.findFont(project.fontId);
    var scale = width / DESIGN_WIDTH;
    var dw = DESIGN_WIDTH;
    var dh = height / scale;
    /* Wider formats get slightly smaller type so landscape slides stay balanced. */
    var s = Math.min(1, dh / 1350 + 0.28);

    ctx.save();
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, dw, dh);
    drawBackground(ctx, dw, dh, theme, project.background);

    var contentX = PAD * s;
    var contentWidth = dw - PAD * s * 2;
    var footerSpace = 150 * s;
    var contentTop = PAD * s * 1.1;
    var contentHeight = dh - contentTop - footerSpace;

    var range = headingRange(slide.layout, s);
    var blocks = null;
    var totalHeight = 0;
    for (var size = range.max; size >= range.min - 0.5; size -= 3) {
      blocks = buildBlocks(slide, project, theme, size, s);
      totalHeight = 0;
      blocks.forEach(function (block) {
        totalHeight += measureBlock(ctx, block, font, contentWidth).height;
      });
      if (totalHeight <= contentHeight) break;
    }

    /* Short slides look unbalanced when they are hard top-aligned, so leftover
       space is split: centred for the hero layouts, top-weighted for the rest. */
    var slack = Math.max(0, contentHeight - totalHeight);
    var y = contentTop + slack * (VERTICAL_WEIGHT[slide.layout] || 0.3);
    blocks.forEach(function (block) {
      var measured = measureBlock(ctx, block, font, contentWidth);
      drawBlock(ctx, block, contentX, y, contentWidth, theme, font);
      y += measured.height;
    });

    drawFooter(ctx, dw, dh, slide, project, theme, font, index, total, s);

    if (options.guides) {
      ctx.strokeStyle = 'rgba(255,0,128,0.65)';
      ctx.setLineDash([16, 12]);
      ctx.lineWidth = 3;
      ctx.strokeRect(PAD * s, PAD * s, dw - PAD * s * 2, dh - PAD * s * 2);
      ctx.setLineDash([]);
    }
    ctx.restore();
  };

  CS.renderToCanvas = function (canvas, options) {
    canvas.width = options.width;
    canvas.height = options.height;
    var ctx = canvas.getContext('2d');
    CS.renderSlide(ctx, options);
    return canvas;
  };

  CS.renderOffscreen = function (options) {
    var canvas = document.createElement('canvas');
    return CS.renderToCanvas(canvas, options);
  };
})();
