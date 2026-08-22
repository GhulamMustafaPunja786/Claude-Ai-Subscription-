# Carousel Studio

Make swipeable carousels for Instagram and LinkedIn without Canva, a subscription or an internet connection.

Write your slides, watch the carousel preview swipe exactly like the real post, then export:

- **ZIP of PNGs** at 1080 x 1350 (or 1080 x 1080, 1080 x 1920, 1200 x 900) for Instagram, Facebook and TikTok
- **PDF** for a LinkedIn document carousel, one slide per page
- **Single PNG** for the slide you are looking at
- **Project file** (`.json`) so you can reopen and edit the carousel later

Everything runs in your browser. Nothing is uploaded anywhere, there is no build step, and there is nothing to install.

## Open it

Double-click `index.html`. That is the whole setup.

If you would rather serve it over `http://` (handy on a phone on the same wifi):

```bash
cd carousel-studio
python3 -m http.server 8123
# then open http://localhost:8123
```

Your work is saved to the browser's local storage as you type, so a refresh or a
closed tab does not lose the carousel. Use **Save project** for a copy you can
keep in a folder or send to someone else.

## Make a carousel in five minutes

1. Open `index.html`. A finished example carousel loads so you never start at a blank page.
2. **Start from a pack** (left column) swaps in a different example: e-commerce tips, SEO tips or a how-to.
3. Click a slide in the list, then edit the small label, headline and body on the right.
4. Set **Size**, **Theme**, **Font** and **Background** once — every slide follows.
5. Put your handle and logo in **Brand**. Page numbers, the swipe hint and the progress bar are automatic.
6. Write the caption you will paste when posting. It travels with the export as `caption.txt`.
7. Export: **ZIP of PNGs** for Instagram, **PDF** for LinkedIn.

## Slide layouts

| Layout | Use it for | Headline field | Body field |
| --- | --- | --- | --- |
| Cover (hook) | Slide 1, the scroll-stopper | The hook | One supporting line |
| Headline + text | The standard teaching slide | The point | Two or three sentences |
| Checklist / bullets | Steps, do/don't lists | The point | One line per bullet |
| Quote | A line you want to land hard | The quote | Who said it |
| Big number | A stat or price | Just the number, e.g. `1.6 g` | What it means |
| Call to action | The last slide | The ask | Detail under the ask |

## Paste an outline instead of clicking

Write your carousel anywhere (notes app, ChatGPT, email) and paste it into
**Paste an outline** to build every slide at once.

```
@ Nutrition
# 3 things to fix before your next shake
Takes five minutes, saves you money.
---
@ Step 1
# Read grams per serving
- Not grams per tub
- Not scoops per tub
- Protein per 100 g is the honest number
---
:: cta
# Save this for your next shop
Follow for the label breakdown series.
```

| Marker | Meaning |
| --- | --- |
| `---` on its own line | Start a new slide |
| `# text` | The headline |
| `@ text` | The small pill label above the headline |
| `- text` | A checklist line (switches the slide to the bullets layout) |
| `:: cover` `:: text` `:: bullets` `:: quote` `:: stat` `:: cta` | Force a layout |
| anything else | Body copy |

## Keyboard and mouse

- Drag or swipe the preview, or click the arrows and dots
- `←` and `→` move between slides when the cursor is not in a text box
- **Show safe-area guide** draws the margin Instagram's interface can cover

## What ends up in the ZIP

```
01-5-protein-mistakes-killing-your-results.png
02-what-we-are-fixing-today.png
...
caption.txt      the caption you wrote
project.json     reopen this file to keep editing
```

## Documentation

- [Posting guide](docs/posting-guide.md) — sizes, slide counts and how to upload to each network
- [Customising](docs/customising.md) — add your own theme colours, fonts and sizes

## Tests

The app itself has no dependencies. `npm install` is only needed to run the tests,
which drive the real UI in Chrome and check the real exported files.

```bash
npm install
npm test            # unit + end to end
npm run test:unit   # ZIP and PDF writers
npm run test:e2e    # Chrome: preview, editing, downloads, PDF and ZIP validation
node tests/render-samples.js ./out   # render one PNG per layout to eyeball the design
```

`npm run test:e2e` needs Chrome. It looks in the usual places and honours
`CHROME_PATH=/path/to/chrome`. The ZIP check uses `unzip` and the PDF check uses
`pdfinfo` and `pdftoppm` from poppler-utils.

## How it works

| File | Job |
| --- | --- |
| `js/design.js` | Sizes, themes, fonts, layout and background lists |
| `js/state.js` | The project object, validation and local storage |
| `js/render.js` | Draws a slide onto a canvas in a 1080-wide design space |
| `js/carousel.js` | The swipeable preview (arrows, dots, drag, keyboard) |
| `js/zip.js` | ZIP writer, written from scratch (stored entries, CRC32) |
| `js/pdf.js` | PDF writer, one full-bleed JPEG per page via `/DCTDecode` |
| `js/export.js` | Renders at full size and triggers the downloads |
| `js/packs.js` | Example carousels and the outline parser |
| `js/app.js` | Connects the DOM to the project state |

The ZIP and PDF writers are hand written so the tool never needs a CDN, an npm
install or a network connection at runtime.
