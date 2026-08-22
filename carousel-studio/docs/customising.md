# Customising

Everything you would normally want to change lives in `js/design.js`. Edit the
file, save, refresh the page. There is no build step.

## Add your brand colours as a theme

```js
CS.THEMES = [
  // ...existing themes
  {
    id: 'liftthecity',
    label: 'Lift The City',
    bg: '#0B0B0C',        // background start
    bg2: '#1A1213',       // background end (used by the gradient)
    text: '#FFFFFF',      // headlines and bullet text
    muted: '#A9A2A2',     // body copy and the footer
    accent: '#E11D2E',    // pill, checkmarks, progress bar, buttons
    accentText: '#FFFFFF' // text drawn on top of the accent colour
  }
];
```

Pick `accentText` so it is readable on `accent`: near-white on a dark accent,
near-black on a bright accent.

## Add a font

Canvas uses whatever fonts the computer already has, so use a stack with
fallbacks and put your first choice first.

```js
CS.FONTS = [
  // ...existing fonts
  { id: 'brand', label: 'Brand font', stack: '"Your Font", Inter, Arial, sans-serif' }
];
```

To use a font that is not installed, add a `@font-face` rule to
`assets/styles.css` pointing at a file you drop in `assets/`, then reference the
same family name in the stack. Keep the file local so the tool still works
offline.

## Add a size

```js
CS.FORMATS = [
  // ...existing formats
  { id: 'pinterest', label: 'Pinterest 2:3 - 1000 x 1500', w: 1000, h: 1500 }
];
```

The renderer scales everything from a 1080-wide design space, so any width works.

## Change the look of a layout

`js/render.js` builds each slide as a vertical stack of blocks in
`buildBlocks()`. Common tweaks:

| What you want | Where |
| --- | --- |
| Bigger or smaller headlines | `headingRange()` — max and min size per layout |
| More or less outer margin | `PAD` at the top of the file |
| Where short slides sit vertically | `VERTICAL_WEIGHT` (0 = top, 0.5 = centred) |
| Footer, page numbers, swipe hint, progress bar | `drawFooter()` |
| Background treatments | `drawBackground()` and the `CS.BACKGROUNDS` list |

After editing the renderer, check every layout at once:

```bash
node tests/render-samples.js ./out
```

## Change the example packs

`js/packs.js` holds the starter carousels. Replace one with your own best
performing post so the next carousel starts from a proven structure — a pack is
just a project object with slides, a theme and a caption.

## Export settings

- PNG is lossless and is what the ZIP contains.
- The PDF embeds each slide as a JPEG at quality 0.92 (`js/export.js`, `CS.exportPdf`) and lays pages out at 150 DPI (`js/pdf.js`, `DEFAULT_DPI`). Raise the quality for text-heavy slides if you want larger, sharper files.
