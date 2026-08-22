/* Starter carousels and the plain-text outline importer. */
window.CS = window.CS || {};

(function () {
  CS.PACKS = [
    {
      id: 'supplements',
      label: 'E-commerce / supplements tips',
      project: {
        name: 'Protein mistakes carousel',
        themeId: 'power',
        fontId: 'sans',
        background: 'glow',
        brand: { handle: '@liftthecity', ctaText: 'Follow for more', showPageNumbers: true, showSwipeHint: true, showHandle: true, logoDataUrl: '' },
        caption: '5 protein mistakes that quietly kill your results.\n\nSave this before your next shake.\n\n#supplements #protein #fitnesstips #gymtok #nutrition',
        slides: [
          { layout: 'cover', eyebrow: 'Nutrition', heading: '5 protein mistakes killing your results', body: 'Most people get 3 of these wrong. Number 4 is the expensive one.' },
          { layout: 'bullets', eyebrow: 'Quick list', heading: 'What we are fixing today', body: 'Timing your intake badly\nToo little per meal\nOnly one protein source\nPaying for filler blends\nSkipping breakfast protein' },
          { layout: 'text', eyebrow: 'Mistake 1', heading: 'You save all your protein for dinner', body: 'Your body uses protein best in 25-40 g doses spread across the day. One giant meal wastes most of it.' },
          { layout: 'stat', eyebrow: 'The number', heading: '1.6 g', body: 'Grams of protein per kilo of bodyweight is the sweet spot for building muscle in most training people.' },
          { layout: 'quote', heading: 'Cheap protein is only cheap until you read the label.', body: 'Every gram of filler is a gram you paid for and did not use' },
          { layout: 'bullets', eyebrow: 'Do this', heading: 'Your 7 day fix', body: 'Add 30 g protein to breakfast\nCheck grams per serving, not per tub\nRotate whey, eggs and lentils\nWeigh one meal to calibrate your eye' },
          { layout: 'cta', eyebrow: 'Your turn', heading: 'Which mistake were you making?', body: 'Tell me in the comments and save this for your next shop.' }
        ]
      }
    },
    {
      id: 'seo',
      label: 'SEO / marketing tips',
      project: {
        name: 'Shopify SEO wins carousel',
        themeId: 'midnight',
        fontId: 'grotesk',
        background: 'gradient',
        brand: { handle: '@yourbrand', ctaText: 'Save this post', showPageNumbers: true, showSwipeHint: true, showHandle: true, logoDataUrl: '' },
        caption: '6 Shopify SEO fixes you can ship this week - no developer needed.\n\n#seo #shopify #ecommerce #marketing',
        slides: [
          { layout: 'cover', eyebrow: 'SEO', heading: '6 Shopify SEO fixes you can ship this week', body: 'No developer, no apps, no risk to your theme.' },
          { layout: 'text', eyebrow: 'Fix 1', heading: 'Write titles for humans, not robots', body: 'Brand + product + the words a buyer actually types. Keep it under 60 characters so Google shows all of it.' },
          { layout: 'bullets', eyebrow: 'Fix 2', heading: 'Clean up your collection pages', body: 'One clear H1 per page\n120 words of real copy\nInternal links to your best products\nNo duplicate filtered URLs indexed' },
          { layout: 'stat', eyebrow: 'Why it matters', heading: '2.5s', body: 'Largest Contentful Paint under 2.5 seconds is the target Google uses to judge your page speed.' },
          { layout: 'cta', eyebrow: 'Next step', heading: 'Want the full audit checklist?', body: 'Comment AUDIT and I will send the sheet I use for client stores.' }
        ]
      }
    },
    {
      id: 'howto',
      label: 'How-to / educational',
      project: {
        name: 'How to carousel',
        themeId: 'paper',
        fontId: 'serif',
        background: 'block',
        brand: { handle: '@yourbrand', ctaText: 'Follow for part 2', showPageNumbers: true, showSwipeHint: true, showHandle: true, logoDataUrl: '' },
        caption: 'A simple 4 step framework you can use today.',
        slides: [
          { layout: 'cover', eyebrow: 'Guide', heading: 'How to plan a month of content in one afternoon', body: 'The exact 4 step framework I use with clients.' },
          { layout: 'text', eyebrow: 'Step 1', heading: 'Start with 4 questions your buyers ask', body: 'Pull them from your DMs, reviews and support inbox. Real questions beat clever ideas every time.' },
          { layout: 'text', eyebrow: 'Step 2', heading: 'Turn each question into one carousel', body: 'One question, one hook, seven slides. Do not mix two ideas in the same post.' },
          { layout: 'bullets', eyebrow: 'Step 3', heading: 'Reuse every post three ways', body: 'Carousel for the feed\nCover slide as a story\nBody copy as an email' },
          { layout: 'cta', eyebrow: 'Step 4', heading: 'Publish before it is perfect', body: 'Consistency beats polish. Ship it, then improve it.' }
        ]
      }
    }
  ];

  CS.loadPack = function (packId) {
    var pack = CS.PACKS.find(function (p) { return p.id === packId; });
    if (!pack) return null;
    var project = CS.normalizeProject(JSON.parse(JSON.stringify(pack.project)));
    project.activeIndex = 0;
    return project;
  };

  /* Plain-text outline -> slides.
     Blocks are separated by a line containing only "---".
       :: layout   choose the layout for the block (cover, text, bullets, quote, stat, cta)
       @ label     small pill label above the heading
       # Heading   the headline
       - item      a checklist line (switches the block to the bullets layout)
       anything else becomes body copy */
  CS.parseOutline = function (text) {
    var blocks = String(text || '').split(/^\s*---\s*$/m);
    var slides = [];

    blocks.forEach(function (block, blockIndex) {
      var lines = block.split('\n');
      var layout = null;
      var eyebrow = '';
      var heading = '';
      var bullets = [];
      var body = [];

      lines.forEach(function (rawLine) {
        var line = rawLine.trim();
        if (!line) return;
        if (/^::/.test(line)) {
          var candidate = line.replace(/^::\s*/, '').toLowerCase();
          if (CS.LAYOUTS.some(function (l) { return l.id === candidate; })) layout = candidate;
          return;
        }
        if (/^@/.test(line)) { eyebrow = line.replace(/^@\s*/, ''); return; }
        if (/^#/.test(line)) {
          var value = line.replace(/^#+\s*/, '');
          if (heading) body.push(value); else heading = value;
          return;
        }
        if (/^[-*\u2022]\s+/.test(line)) { bullets.push(line.replace(/^[-*\u2022]\s+/, '')); return; }
        body.push(line);
      });

      if (!heading && !body.length && !bullets.length) return;
      if (!heading) { heading = body.shift() || ''; }
      if (!layout) {
        if (bullets.length) layout = 'bullets';
        else if (slides.length === 0 && blockIndex === 0) layout = 'cover';
        else layout = 'text';
      }

      slides.push(CS.newSlide(layout, {
        eyebrow: eyebrow,
        heading: heading,
        body: (layout === 'bullets' && bullets.length ? bullets : body).join('\n')
      }));
    });

    return slides;
  };

  CS.OUTLINE_EXAMPLE = [
    '@ Nutrition',
    '# 3 things to fix before your next shake',
    'Takes five minutes, saves you money.',
    '---',
    '@ Step 1',
    '# Read grams per serving',
    '- Not grams per tub',
    '- Not scoops per tub',
    '- Protein per 100 g is the honest number',
    '---',
    ':: cta',
    '# Save this for your next shop',
    'Follow for the label breakdown series.'
  ].join('\n');
})();
