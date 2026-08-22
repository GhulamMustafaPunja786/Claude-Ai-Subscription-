# Carousel

A lightweight, dependency-free image/content carousel built with plain HTML,
CSS, and JavaScript. No frameworks or build step required.

## Features

- Prev/next arrow buttons
- Dot indicators
- Autoplay with a progress bar, auto-pauses on hover/focus
- Keyboard navigation (Left/Right arrow keys)
- Touch and mouse drag/swipe support
- Fully responsive (scales with its container, `aspect-ratio: 2 / 1`)
- Multiple independent carousels per page are supported automatically

## Try it locally

Open `index.html` directly in a browser, or serve the folder:

```bash
cd carousel
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Using it in your own page

1. Copy `carousel.js` and `style.css` (or the relevant CSS rules) into your project.
2. Add the markup:

```html
<div class="carousel" data-autoplay="4500" data-loop="true">
  <div class="carousel-track">
    <div class="carousel-slide">
      <img src="your-image-1.jpg" alt="..." />
      <div class="carousel-caption">
        <h2>Title</h2>
        <p>Subtitle or description</p>
      </div>
    </div>
    <div class="carousel-slide">
      <img src="your-image-2.jpg" alt="..." />
    </div>
    <!-- add as many .carousel-slide elements as you need -->
  </div>
</div>
```

3. Include the script once per page:

```html
<script src="carousel.js"></script>
```

The script auto-initializes every `.carousel` element found on `DOMContentLoaded`.
You can also initialize manually:

```html
<script>
  const el = document.querySelector('.carousel');
  const instance = new Carousel(el, { autoplay: 5000, loop: true });
</script>
```

### Options (via `data-*` attributes or the JS constructor)

| Option     | Attribute        | Default | Description                                   |
| ---------- | ---------------- | ------- | ---------------------------------------------- |
| `autoplay` | `data-autoplay`  | `0`     | Milliseconds between auto-advances. `0` disables autoplay. |
| `loop`     | `data-loop`      | `true`  | Whether the carousel wraps from the last slide back to the first (and vice versa). |

### Listening for slide changes

```js
document.querySelector('.carousel').addEventListener('carousel:change', (e) => {
  console.log('Now showing slide', e.detail.index);
});
```

## Embedding in Shopify (or another CMS)

Most CMS/theme editors let you drop in a raw HTML block:

1. Paste the CSS from `style.css` into a `<style>` tag (or your theme's custom CSS section).
2. Paste the `carousel.js` contents into a `<script>` tag (or upload it as a theme asset and reference it with `<script src="{{ 'carousel.js' | asset_url }}"></script>` in Shopify's Liquid).
3. Paste the `.carousel` markup from `index.html` into a "Custom HTML" section, swapping in your own product/promo images and links.

No external dependencies or API keys are required.
