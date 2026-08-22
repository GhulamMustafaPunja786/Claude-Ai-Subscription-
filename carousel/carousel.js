/**
 * Lightweight, dependency-free carousel/slider.
 *
 * Usage:
 *   <div class="carousel" data-autoplay="5000" data-loop="true">
 *     <div class="carousel-track">
 *       <div class="carousel-slide">...</div>
 *       ...
 *     </div>
 *   </div>
 *
 *   new Carousel(document.querySelector('.carousel'));
 *
 * Features: autoplay (pauses on hover/focus), prev/next arrows, dot
 * indicators, keyboard navigation (Left/Right), touch & mouse drag/swipe,
 * and a progress bar for the autoplay timer.
 */
class Carousel {
  constructor(root, options = {}) {
    this.root = root;
    this.track = root.querySelector(".carousel-track");
    this.slides = Array.from(this.track.children);
    this.slideCount = this.slides.length;

    this.options = {
      autoplay: Number(root.dataset.autoplay || options.autoplay || 0),
      loop: (root.dataset.loop ?? String(options.loop ?? true)) !== "false",
      ...options,
    };

    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.progressRaf = null;
    this.autoplayStartedAt = 0;
    this.isPaused = false;
    this.dragState = null;

    this._buildControls();
    this._bindEvents();
    this._goTo(0, { instant: true });

    if (this.options.autoplay > 0) {
      this._startAutoplay();
    }
  }

  _buildControls() {
    this.root.setAttribute("tabindex", "0");
    this.root.setAttribute("role", "region");
    this.root.setAttribute("aria-roledescription", "carousel");

    this.prevBtn = this._createButton("carousel-arrow carousel-arrow--prev", "\u2039", "Previous slide");
    this.nextBtn = this._createButton("carousel-arrow carousel-arrow--next", "\u203a", "Next slide");
    this.root.append(this.prevBtn, this.nextBtn);

    this.dotsWrap = document.createElement("div");
    this.dotsWrap.className = "carousel-dots";
    this.dots = this.slides.map((_, i) => {
      const dot = this._createButton("carousel-dot", "", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => this._goTo(i));
      this.dotsWrap.appendChild(dot);
      return dot;
    });
    this.root.appendChild(this.dotsWrap);

    if (this.options.autoplay > 0) {
      this.progressBar = document.createElement("div");
      this.progressBar.className = "carousel-progress";
      this.root.appendChild(this.progressBar);
    }

    this.slides.forEach((slide, i) => {
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", `${i + 1} of ${this.slideCount}`);
    });
  }

  _createButton(className, text, label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.textContent = text;
    btn.setAttribute("aria-label", label);
    return btn;
  }

  _bindEvents() {
    this.prevBtn.addEventListener("click", () => {
      this.prev();
      this._restartAutoplay();
    });
    this.nextBtn.addEventListener("click", () => {
      this.next();
      this._restartAutoplay();
    });

    this.root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.prev();
        this._restartAutoplay();
      } else if (e.key === "ArrowRight") {
        this.next();
        this._restartAutoplay();
      }
    });

    this.root.addEventListener("mouseenter", () => this._pauseAutoplay());
    this.root.addEventListener("mouseleave", () => this._resumeAutoplay());
    this.root.addEventListener("focusin", () => this._pauseAutoplay());
    this.root.addEventListener("focusout", () => this._resumeAutoplay());

    this.root.addEventListener("pointerdown", (e) => this._onDragStart(e));
    this.root.addEventListener("pointermove", (e) => this._onDragMove(e));
    this.root.addEventListener("pointerup", (e) => this._onDragEnd(e));
    this.root.addEventListener("pointercancel", (e) => this._onDragEnd(e));

    window.addEventListener("resize", () => this._goTo(this.currentIndex, { instant: true }));
  }

  _onDragStart(e) {
    this.dragState = {
      startX: e.clientX,
      currentX: e.clientX,
      width: this.root.clientWidth,
      pointerId: e.pointerId,
    };
    this.root.classList.add("is-dragging");
    this.root.setPointerCapture(e.pointerId);
    this._pauseAutoplay();
  }

  _onDragMove(e) {
    if (!this.dragState || e.pointerId !== this.dragState.pointerId) return;
    this.dragState.currentX = e.clientX;
    const delta = this.dragState.currentX - this.dragState.startX;
    const basePercent = -this.currentIndex * 100;
    const deltaPercent = (delta / this.dragState.width) * 100;
    this.track.style.transform = `translateX(${basePercent + deltaPercent}%)`;
  }

  _onDragEnd(e) {
    if (!this.dragState || e.pointerId !== this.dragState.pointerId) return;
    const delta = this.dragState.currentX - this.dragState.startX;
    const threshold = this.dragState.width * 0.15;

    this.root.classList.remove("is-dragging");

    if (delta > threshold) {
      this.prev();
    } else if (delta < -threshold) {
      this.next();
    } else {
      this._goTo(this.currentIndex);
    }

    this.dragState = null;
    this._resumeAutoplay();
  }

  prev() {
    const nextIndex = this.currentIndex - 1;
    if (nextIndex < 0) {
      if (this.options.loop) this._goTo(this.slideCount - 1);
      return;
    }
    this._goTo(nextIndex);
  }

  next() {
    const nextIndex = this.currentIndex + 1;
    if (nextIndex >= this.slideCount) {
      if (this.options.loop) this._goTo(0);
      return;
    }
    this._goTo(nextIndex);
  }

  _goTo(index, { instant = false } = {}) {
    this.currentIndex = Math.max(0, Math.min(index, this.slideCount - 1));

    if (instant) {
      const prevTransition = this.track.style.transition;
      this.track.style.transition = "none";
      this.track.style.transform = `translateX(${-this.currentIndex * 100}%)`;
      requestAnimationFrame(() => {
        this.track.style.transition = prevTransition;
      });
    } else {
      this.track.style.transform = `translateX(${-this.currentIndex * 100}%)`;
    }

    this.dots.forEach((dot, i) => dot.classList.toggle("is-active", i === this.currentIndex));

    this.root.dispatchEvent(
      new CustomEvent("carousel:change", { detail: { index: this.currentIndex } })
    );
  }

  _startAutoplay() {
    this._clearAutoplay();
    this.autoplayStartedAt = performance.now();

    this.autoplayTimer = setTimeout(() => {
      this.next();
      this._startAutoplay();
    }, this.options.autoplay);

    if (this.progressBar) this._animateProgress();
  }

  _animateProgress() {
    const step = () => {
      const elapsed = performance.now() - this.autoplayStartedAt;
      const pct = this.isPaused ? this._pausedPct ?? 0 : Math.min(100, (elapsed / this.options.autoplay) * 100);
      if (this.progressBar) this.progressBar.style.width = `${pct}%`;
      if (!this.isPaused && pct < 100) {
        this.progressRaf = requestAnimationFrame(step);
      }
    };
    this.progressRaf = requestAnimationFrame(step);
  }

  _pauseAutoplay() {
    if (!this.autoplayTimer) return;
    this.isPaused = true;
    clearTimeout(this.autoplayTimer);
    this.autoplayTimer = null;
    this._pausedElapsed = performance.now() - this.autoplayStartedAt;
    this._pausedPct = this.progressBar
      ? Math.min(100, (this._pausedElapsed / this.options.autoplay) * 100)
      : 0;
    if (this.progressRaf) cancelAnimationFrame(this.progressRaf);
  }

  _resumeAutoplay() {
    if (this.options.autoplay <= 0 || !this.isPaused) return;
    this.isPaused = false;
    const remaining = Math.max(0, this.options.autoplay - (this._pausedElapsed || 0));
    this.autoplayStartedAt = performance.now() - (this.options.autoplay - remaining);
    this.autoplayTimer = setTimeout(() => {
      this.next();
      this._startAutoplay();
    }, remaining);
    if (this.progressBar) this._animateProgress();
  }

  _restartAutoplay() {
    if (this.options.autoplay > 0) this._startAutoplay();
  }

  _clearAutoplay() {
    if (this.autoplayTimer) clearTimeout(this.autoplayTimer);
    if (this.progressRaf) cancelAnimationFrame(this.progressRaf);
    this.autoplayTimer = null;
  }

  destroy() {
    this._clearAutoplay();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carousel").forEach((el) => new Carousel(el));
});
