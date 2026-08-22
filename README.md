# Carousels

A lightweight, dependency-free carousel/slider component built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

## Features

- Previous/next arrows and dot pagination (generated automatically)
- Optional infinite looping, or clamped ends with disabled arrows
- Autoplay with a configurable interval (pauses on hover and keyboard focus)
- Touch swipe and mouse drag support
- Keyboard navigation (left/right arrow keys)
- Multiple slides per view with responsive breakpoints
- Easy to theme with plain CSS classes

## Quick start

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

The demo page shows three variants: a looping autoplay hero carousel, a responsive multi-card carousel, and a non-looping testimonial carousel.

## Using it in your own page

1. Include the two files:

```html
<link rel="stylesheet" href="css/carousel.css" />
<script src="js/carousel.js"></script>
```

2. Add the markup (arrows and dots are created for you):

```html
<div class="carousel" id="my-carousel">
  <div class="carousel__viewport">
    <div class="carousel__track">
      <div class="carousel__slide">Slide 1</div>
      <div class="carousel__slide">Slide 2</div>
      <div class="carousel__slide">Slide 3</div>
    </div>
  </div>
</div>
```

3. Initialize it:

```html
<script>
  new Carousel(document.getElementById('my-carousel'), {
    loop: true,       // wrap around at the ends (default: true)
    autoplay: 4000,   // ms between slides; 0 disables autoplay (default: 0)
    perView: 1,       // slides visible at once (default: 1)
    gap: 16,          // px gap between slides (default: 16)
    breakpoints: {    // optional responsive overrides (min-width: { perView })
      640: { perView: 2 },
      1024: { perView: 3 },
    },
  });
</script>
```

### Arrow placement

By default the arrows overlay the slides (good for full-bleed images). For card or text slides, add the `carousel--arrows-outside` modifier class to the root element so the arrows sit half-outside the carousel and never cover content:

```html
<div class="carousel carousel--arrows-outside" id="my-carousel">...</div>
```

## Files

| File | Purpose |
| --- | --- |
| `js/carousel.js` | The `Carousel` class (the whole component) |
| `css/carousel.css` | Component styles (viewport, track, arrows, dots) |
| `index.html` | Demo page with three carousel variants |
| `css/demo.css` | Styles for the demo page only |
