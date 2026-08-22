/* The preview is a real carousel: arrows, dots, keyboard and drag/swipe,
   so what you review on screen behaves like the post your audience will swipe. */
window.CS = window.CS || {};

(function () {
  var PREVIEW_WIDTH = 720;

  CS.Carousel = function (root, options) {
    var opts = options || {};
    this.root = root;
    this.onChange = opts.onChange || function () {};
    this.index = 0;
    this.project = null;
    this.guides = false;
    this.slides = [];
    this.build();
  };

  CS.Carousel.prototype.build = function () {
    var self = this;
    this.root.innerHTML =
      '<div class="carousel">' +
      '  <button class="carousel-nav prev" type="button" aria-label="Previous slide">&#8249;</button>' +
      '  <div class="carousel-viewport"><div class="carousel-track"></div></div>' +
      '  <button class="carousel-nav next" type="button" aria-label="Next slide">&#8250;</button>' +
      '</div>' +
      '<div class="carousel-footer">' +
      '  <div class="carousel-dots" role="tablist"></div>' +
      '  <div class="carousel-counter"></div>' +
      '</div>';

    this.track = this.root.querySelector('.carousel-track');
    this.viewport = this.root.querySelector('.carousel-viewport');
    this.dots = this.root.querySelector('.carousel-dots');
    this.counter = this.root.querySelector('.carousel-counter');

    this.root.querySelector('.prev').addEventListener('click', function () { self.goTo(self.index - 1); });
    this.root.querySelector('.next').addEventListener('click', function () { self.goTo(self.index + 1); });

    var dragging = false;
    var startX = 0;
    var delta = 0;

    this.viewport.addEventListener('pointerdown', function (event) {
      dragging = true;
      startX = event.clientX;
      delta = 0;
      self.track.classList.add('dragging');
      self.viewport.setPointerCapture(event.pointerId);
    });
    this.viewport.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      delta = event.clientX - startX;
      self.track.style.transform = 'translateX(calc(' + (-self.index * 100) + '% + ' + delta + 'px))';
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      self.track.classList.remove('dragging');
      var threshold = self.viewport.clientWidth * 0.16;
      if (delta < -threshold) self.goTo(self.index + 1);
      else if (delta > threshold) self.goTo(self.index - 1);
      else self.position();
    }
    this.viewport.addEventListener('pointerup', endDrag);
    this.viewport.addEventListener('pointercancel', endDrag);
    this.viewport.addEventListener('pointerleave', endDrag);
  };

  CS.Carousel.prototype.position = function () {
    this.track.style.transform = 'translateX(' + (-this.index * 100) + '%)';
  };

  CS.Carousel.prototype.goTo = function (index, silent) {
    if (!this.project) return;
    var total = this.project.slides.length;
    var next = Math.max(0, Math.min(total - 1, index));
    this.index = next;
    this.position();
    this.paintDots();
    if (!silent) this.onChange(next);
  };

  CS.Carousel.prototype.paintDots = function () {
    var self = this;
    var total = this.project ? this.project.slides.length : 0;
    this.dots.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot' + (i === this.index ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.dataset.index = String(i);
      dot.addEventListener('click', function (event) {
        self.goTo(Number(event.currentTarget.dataset.index));
      });
      this.dots.appendChild(dot);
    }
    this.counter.textContent = total ? 'Slide ' + (this.index + 1) + ' of ' + total : '';
    var prev = this.root.querySelector('.prev');
    var next = this.root.querySelector('.next');
    prev.disabled = this.index === 0;
    next.disabled = this.index >= total - 1;
  };

  /* Rebuilds the canvases: use after slides are added, removed or reordered. */
  CS.Carousel.prototype.rebuild = function (project, guides) {
    this.project = project;
    this.guides = !!guides;
    this.track.innerHTML = '';
    this.slides = [];
    var format = CS.findFormat(project.formatId);

    for (var i = 0; i < project.slides.length; i++) {
      var holder = document.createElement('div');
      holder.className = 'carousel-slide';
      var canvas = document.createElement('canvas');
      canvas.style.aspectRatio = format.w + ' / ' + format.h;
      holder.appendChild(canvas);
      this.track.appendChild(holder);
      this.slides.push(canvas);
    }
    this.index = Math.max(0, Math.min(project.slides.length - 1, project.activeIndex || 0));
    this.paint();
    this.position();
    this.paintDots();
  };

  CS.Carousel.prototype.paint = function (onlyIndex) {
    if (!this.project) return;
    var format = CS.findFormat(this.project.formatId);
    var width = Math.min(PREVIEW_WIDTH, format.w);
    var height = Math.round(width * format.h / format.w);
    var self = this;
    this.slides.forEach(function (canvas, i) {
      if (typeof onlyIndex === 'number' && onlyIndex !== i) return;
      CS.renderToCanvas(canvas, {
        project: self.project,
        slide: self.project.slides[i],
        index: i,
        total: self.project.slides.length,
        width: width,
        height: height,
        guides: self.guides
      });
    });
  };

  CS.Carousel.prototype.update = function (project, guides, onlyIndex) {
    this.project = project;
    this.guides = !!guides;
    var format = CS.findFormat(project.formatId);
    this.slides.forEach(function (canvas) {
      canvas.style.aspectRatio = format.w + ' / ' + format.h;
    });
    this.paint(onlyIndex);
    this.paintDots();
  };
})();
