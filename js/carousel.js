/**
 * Carousel — a lightweight, dependency-free carousel/slider.
 *
 * Features: arrows, dot pagination, looping, autoplay (pauses on hover/focus),
 * touch & mouse swipe, keyboard navigation, multiple items per view.
 *
 * Usage:
 *   new Carousel(document.querySelector('#my-carousel'), {
 *     loop: true,
 *     autoplay: 4000,      // ms between slides; 0 disables autoplay
 *     perView: 1,          // slides visible at once
 *     gap: 16,             // px gap between slides
 *     breakpoints: {       // optional responsive overrides (min-width: perView)
 *       640: { perView: 2 },
 *       1024: { perView: 3 },
 *     },
 *   });
 *
 * Expected markup:
 *   <div class="carousel" id="my-carousel">
 *     <div class="carousel__viewport">
 *       <div class="carousel__track">
 *         <div class="carousel__slide">...</div>
 *         ...
 *       </div>
 *     </div>
 *   </div>
 * Arrows and dots are generated automatically.
 */
class Carousel {
  constructor(root, options = {}) {
    this.root = root;
    this.opts = Object.assign(
      { loop: true, autoplay: 0, perView: 1, gap: 16, breakpoints: null },
      options
    );

    this.viewport = root.querySelector('.carousel__viewport');
    this.track = root.querySelector('.carousel__track');
    this.slides = Array.from(this.track.children);
    this.index = 0;
    this.timer = null;

    this._buildControls();
    this._bindEvents();
    this._applyLayout();
    this.goTo(0, false);
    this._startAutoplay();
  }

  get perView() {
    let perView = this.opts.perView;
    if (this.opts.breakpoints) {
      for (const [minWidth, override] of Object.entries(this.opts.breakpoints)) {
        if (window.innerWidth >= Number(minWidth)) perView = override.perView;
      }
    }
    return perView;
  }

  get maxIndex() {
    return Math.max(0, this.slides.length - this.perView);
  }

  _buildControls() {
    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'carousel__arrow carousel__arrow--prev';
    this.prevBtn.setAttribute('aria-label', 'Previous slide');
    this.prevBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'carousel__arrow carousel__arrow--next';
    this.nextBtn.setAttribute('aria-label', 'Next slide');
    this.nextBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

    this.dotsWrap = document.createElement('div');
    this.dotsWrap.className = 'carousel__dots';
    this.dotsWrap.setAttribute('role', 'tablist');

    this.root.append(this.prevBtn, this.nextBtn, this.dotsWrap);
    this._renderDots();
  }

  _renderDots() {
    this.dotsWrap.innerHTML = '';
    this.dots = [];
    for (let i = 0; i <= this.maxIndex; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsWrap.appendChild(dot);
      this.dots.push(dot);
    }
  }

  _bindEvents() {
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    this.root.setAttribute('tabindex', '0');
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
    });

    this.root.addEventListener('mouseenter', () => this._stopAutoplay());
    this.root.addEventListener('mouseleave', () => this._startAutoplay());
    this.root.addEventListener('focusin', () => this._stopAutoplay());
    this.root.addEventListener('focusout', () => this._startAutoplay());

    this._bindDrag();

    window.addEventListener('resize', () => {
      this._applyLayout();
      this._renderDots();
      this.goTo(Math.min(this.index, this.maxIndex), false);
    });
  }

  _bindDrag() {
    let startX = 0;
    let dragging = false;

    const onStart = (x) => { startX = x; dragging = true; this.track.style.transition = 'none'; };
    const onMove = (x) => {
      if (!dragging) return;
      const offset = -this.index * this._step() + (x - startX);
      this.track.style.transform = `translateX(${offset}px)`;
    };
    const onEnd = (x) => {
      if (!dragging) return;
      dragging = false;
      this.track.style.transition = '';
      const delta = x - startX;
      const threshold = this.viewport.offsetWidth * 0.15;
      if (delta < -threshold) this.next();
      else if (delta > threshold) this.prev();
      else this.goTo(this.index, true);
    };

    this.viewport.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
    this.viewport.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    this.viewport.addEventListener('touchend', (e) => onEnd(e.changedTouches[0].clientX));

    this.viewport.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.clientX); });
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', (e) => onEnd(e.clientX));
  }

  _applyLayout() {
    const { gap } = this.opts;
    const perView = this.perView;
    this.track.style.gap = `${gap}px`;
    const slideWidth = `calc((100% - ${gap * (perView - 1)}px) / ${perView})`;
    this.slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}`;
    });
  }

  _step() {
    // Distance in px between consecutive slide positions.
    return this.slides[0].offsetWidth + this.opts.gap;
  }

  goTo(index, animate = true) {
    if (this.opts.loop) {
      if (index < 0) index = this.maxIndex;
      if (index > this.maxIndex) index = 0;
    } else {
      index = Math.max(0, Math.min(index, this.maxIndex));
    }
    this.index = index;

    if (!animate) this.track.style.transition = 'none';
    this.track.style.transform = `translateX(${-index * this._step()}px)`;
    if (!animate) {
      // Force reflow so the no-transition jump applies before re-enabling.
      void this.track.offsetWidth;
      this.track.style.transition = '';
    }

    this.dots.forEach((dot, i) =>
      dot.classList.toggle('carousel__dot--active', i === index)
    );
    if (!this.opts.loop) {
      this.prevBtn.disabled = index === 0;
      this.nextBtn.disabled = index === this.maxIndex;
    }
  }

  next() { this.goTo(this.index + 1); }
  prev() { this.goTo(this.index - 1); }

  _startAutoplay() {
    if (!this.opts.autoplay) return;
    this._stopAutoplay();
    this.timer = setInterval(() => this.next(), this.opts.autoplay);
  }

  _stopAutoplay() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }
}
