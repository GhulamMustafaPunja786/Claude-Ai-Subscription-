/* Wires the DOM to the project state. */
(function () {
  var project = CS.loadLocal() || CS.loadPack('supplements');
  var carousel = null;
  var saveTimer = null;
  var toastTimer = null;

  var el = {};
  ['projectName', 'exportPng', 'exportZip', 'exportPdf', 'saveJson', 'openJson', 'slideList', 'addSlide',
    'packSelect', 'loadPack', 'outline', 'applyOutline', 'outlineExample', 'carousel', 'toggleGuides',
    'stageFormat', 'slideLayout', 'slideEyebrow', 'slideHeading', 'slideBody', 'headingLabel', 'bodyLabel',
    'bodyHint', 'duplicateSlide', 'deleteSlide', 'formatSelect', 'themeSelect', 'fontSelect', 'backgroundSelect',
    'brandHandle', 'brandCta', 'brandLogo', 'clearLogo', 'showHandle', 'showPageNumbers', 'showSwipeHint',
    'caption', 'resetProject', 'toast'].forEach(function (id) {
    el[id] = document.getElementById(id);
  });

  var COPY = {
    cover: { heading: 'Hook', body: 'Sub-line', hint: 'Slide 1 has one job: stop the scroll. Keep it under 10 words.' },
    text: { heading: 'Headline', body: 'Body copy', hint: 'One idea per slide. Two or three short sentences is plenty.' },
    bullets: { heading: 'Headline', body: 'Checklist', hint: 'One line per bullet. Four to five lines reads best.' },
    quote: { heading: 'Quote', body: 'Attribution', hint: 'Short quotes hit harder. The body line becomes the credit.' },
    stat: { heading: 'Big number', body: 'What it means', hint: 'Put only the number in the headline, e.g. 1.6 g or 68%.' },
    cta: { heading: 'Ask', body: 'Detail', hint: 'Ask for one action: comment, save, or follow. Button text lives in Brand.' }
  };

  function toast(message, isError) {
    el.toast.textContent = message;
    el.toast.classList.add('is-visible');
    el.toast.classList.toggle('is-error', !!isError);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.classList.remove('is-visible'); }, 3600);
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { CS.saveLocal(project); }, 400);
  }

  function activeSlide() {
    return project.slides[project.activeIndex];
  }

  function fillSelect(node, items, selectedId) {
    node.innerHTML = '';
    items.forEach(function (item) {
      var option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.label;
      if (item.id === selectedId) option.selected = true;
      node.appendChild(option);
    });
  }

  function paintSlideList() {
    el.slideList.innerHTML = '';
    project.slides.forEach(function (slide, index) {
      var layout = CS.LAYOUTS.find(function (l) { return l.id === slide.layout; });
      var row = document.createElement('li');
      row.className = 'slide-row' + (index === project.activeIndex ? ' is-active' : '');
      row.innerHTML =
        '<span class="num">' + (index + 1) + '</span>' +
        '<span class="meta">' +
        '  <span class="title"></span>' +
        '  <span class="layout">' + (layout ? layout.label : slide.layout) + '</span>' +
        '</span>' +
        '<span class="tools">' +
        '  <button class="icon-btn" type="button" data-action="up" title="Move up" ' + (index === 0 ? 'disabled' : '') + '>&#9650;</button>' +
        '  <button class="icon-btn" type="button" data-action="down" title="Move down" ' + (index === project.slides.length - 1 ? 'disabled' : '') + '>&#9660;</button>' +
        '  <button class="icon-btn" type="button" data-action="remove" title="Delete slide" ' + (project.slides.length < 2 ? 'disabled' : '') + '>&#10005;</button>' +
        '</span>';
      row.querySelector('.title').textContent = slide.heading || '(empty slide)';

      row.addEventListener('click', function (event) {
        var action = event.target instanceof HTMLElement ? event.target.dataset.action : null;
        if (action === 'up') return moveSlide(index, -1);
        if (action === 'down') return moveSlide(index, 1);
        if (action === 'remove') return removeSlide(index);
        selectSlide(index);
      });
      el.slideList.appendChild(row);
    });
  }

  function paintEditor() {
    var slide = activeSlide();
    var copy = COPY[slide.layout] || COPY.text;
    el.slideLayout.value = slide.layout;
    el.slideEyebrow.value = slide.eyebrow;
    el.slideHeading.value = slide.heading;
    el.slideBody.value = slide.body;
    el.headingLabel.textContent = copy.heading;
    el.bodyLabel.textContent = copy.body;
    el.bodyHint.textContent = copy.hint;
    el.deleteSlide.disabled = project.slides.length < 2;
  }

  function paintStageInfo() {
    var format = CS.findFormat(project.formatId);
    el.stageFormat.textContent = format.w + ' x ' + format.h + ' px  ·  ' + project.slides.length +
      (project.slides.length === 1 ? ' slide' : ' slides');
  }

  function paintChrome() {
    el.projectName.value = project.name;
    el.formatSelect.value = project.formatId;
    el.themeSelect.value = project.themeId;
    el.fontSelect.value = project.fontId;
    el.backgroundSelect.value = project.background;
    el.brandHandle.value = project.brand.handle;
    el.brandCta.value = project.brand.ctaText;
    el.showHandle.checked = !!project.brand.showHandle;
    el.showPageNumbers.checked = !!project.brand.showPageNumbers;
    el.showSwipeHint.checked = !!project.brand.showSwipeHint;
    el.caption.value = project.caption;
  }

  /* structural = slides were added, removed or reordered (canvases must be rebuilt) */
  function refresh(structural) {
    paintSlideList();
    paintEditor();
    paintStageInfo();
    if (structural) carousel.rebuild(project, el.toggleGuides.checked);
    else carousel.update(project, el.toggleGuides.checked);
    scheduleSave();
  }

  function refreshActiveSlideOnly() {
    paintSlideList();
    carousel.update(project, el.toggleGuides.checked, project.activeIndex);
    scheduleSave();
  }

  function selectSlide(index) {
    project.activeIndex = Math.max(0, Math.min(project.slides.length - 1, index));
    paintSlideList();
    paintEditor();
    carousel.goTo(project.activeIndex, true);
    scheduleSave();
  }

  function moveSlide(index, direction) {
    var target = index + direction;
    if (target < 0 || target >= project.slides.length) return;
    var slides = project.slides;
    var moved = slides.splice(index, 1)[0];
    slides.splice(target, 0, moved);
    project.activeIndex = target;
    refresh(true);
  }

  function removeSlide(index) {
    if (project.slides.length < 2) return;
    project.slides.splice(index, 1);
    project.activeIndex = Math.max(0, Math.min(project.slides.length - 1, index - 1));
    refresh(true);
    toast('Slide deleted');
  }

  function replaceProject(next, message) {
    project = next;
    paintChrome();
    refresh(true);
    if (message) toast(message);
  }

  function runExport(button, task, label) {
    var original = button.textContent;
    button.disabled = true;
    button.textContent = 'Working...';
    Promise.resolve()
      .then(task)
      .then(function (result) {
        toast(label + ' downloaded' + (result && result.pages ? ' (' + result.pages + ' pages)' : ''));
      })
      .catch(function (error) {
        toast('Export failed: ' + error.message, true);
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = original;
      });
  }

  function bind() {
    fillSelect(el.slideLayout, CS.LAYOUTS);
    fillSelect(el.formatSelect, CS.FORMATS);
    fillSelect(el.themeSelect, CS.THEMES);
    fillSelect(el.fontSelect, CS.FONTS);
    fillSelect(el.backgroundSelect, CS.BACKGROUNDS);
    fillSelect(el.packSelect, CS.PACKS);

    el.projectName.addEventListener('input', function () {
      project.name = el.projectName.value;
      scheduleSave();
    });

    el.slideLayout.addEventListener('change', function () {
      activeSlide().layout = el.slideLayout.value;
      paintEditor();
      refreshActiveSlideOnly();
    });

    [['slideEyebrow', 'eyebrow'], ['slideHeading', 'heading'], ['slideBody', 'body']].forEach(function (pair) {
      el[pair[0]].addEventListener('input', function () {
        activeSlide()[pair[1]] = el[pair[0]].value;
        refreshActiveSlideOnly();
      });
    });

    el.addSlide.addEventListener('click', function () {
      var at = project.activeIndex + 1;
      project.slides.splice(at, 0, CS.newSlide('text'));
      project.activeIndex = at;
      refresh(true);
    });

    el.duplicateSlide.addEventListener('click', function () {
      var copy = CS.newSlide(activeSlide().layout, {
        eyebrow: activeSlide().eyebrow,
        heading: activeSlide().heading,
        body: activeSlide().body
      });
      project.slides.splice(project.activeIndex + 1, 0, copy);
      project.activeIndex += 1;
      refresh(true);
    });

    el.deleteSlide.addEventListener('click', function () { removeSlide(project.activeIndex); });

    ['formatSelect', 'themeSelect', 'fontSelect', 'backgroundSelect'].forEach(function (id) {
      el[id].addEventListener('change', function () {
        if (id === 'formatSelect') project.formatId = el[id].value;
        if (id === 'themeSelect') project.themeId = el[id].value;
        if (id === 'fontSelect') project.fontId = el[id].value;
        if (id === 'backgroundSelect') project.background = el[id].value;
        refresh(false);
      });
    });

    el.brandHandle.addEventListener('input', function () {
      project.brand.handle = el.brandHandle.value;
      refresh(false);
    });
    el.brandCta.addEventListener('input', function () {
      project.brand.ctaText = el.brandCta.value;
      refresh(false);
    });
    ['showHandle', 'showPageNumbers', 'showSwipeHint'].forEach(function (id) {
      el[id].addEventListener('change', function () {
        project.brand[id] = el[id].checked;
        refresh(false);
      });
    });

    el.brandLogo.addEventListener('change', function () {
      var file = el.brandLogo.files && el.brandLogo.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        project.brand.logoDataUrl = String(reader.result);
        CS.preloadImage(project.brand.logoDataUrl).then(function (image) {
          if (!image) {
            project.brand.logoDataUrl = '';
            toast('That file could not be read as an image', true);
          }
          refresh(false);
        });
      };
      reader.readAsDataURL(file);
    });

    el.clearLogo.addEventListener('click', function () {
      project.brand.logoDataUrl = '';
      el.brandLogo.value = '';
      refresh(false);
    });

    el.caption.addEventListener('input', function () {
      project.caption = el.caption.value;
      scheduleSave();
    });

    el.toggleGuides.addEventListener('change', function () { refresh(false); });

    el.loadPack.addEventListener('click', function () {
      var next = CS.loadPack(el.packSelect.value);
      if (next) replaceProject(next, 'Pack loaded — edit away');
    });

    el.outlineExample.addEventListener('click', function () {
      el.outline.value = CS.OUTLINE_EXAMPLE;
    });

    el.applyOutline.addEventListener('click', function () {
      var slides = CS.parseOutline(el.outline.value);
      if (!slides.length) return toast('Nothing to build — paste some text first', true);
      project.slides = slides;
      project.activeIndex = 0;
      refresh(true);
      toast('Built ' + slides.length + (slides.length === 1 ? ' slide' : ' slides'));
    });

    el.resetProject.addEventListener('click', function () {
      replaceProject(CS.newProject(), 'Empty carousel ready');
    });

    el.exportPng.addEventListener('click', function () {
      runExport(el.exportPng, function () { return CS.exportPng(project, project.activeIndex); }, 'PNG');
    });
    el.exportZip.addEventListener('click', function () {
      runExport(el.exportZip, function () { return CS.exportZip(project); }, 'ZIP');
    });
    el.exportPdf.addEventListener('click', function () {
      runExport(el.exportPdf, function () { return CS.exportPdf(project); }, 'PDF');
    });
    el.saveJson.addEventListener('click', function () {
      runExport(el.saveJson, function () { return CS.exportJson(project); }, 'Project file');
    });

    el.openJson.addEventListener('change', function () {
      var file = el.openJson.files && el.openJson.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var next = CS.normalizeProject(JSON.parse(String(reader.result)));
          CS.preloadImage(next.brand.logoDataUrl).then(function () {
            replaceProject(next, 'Project opened');
          });
        } catch (error) {
          toast('That file is not a Carousel Studio project', true);
        }
        el.openJson.value = '';
      };
      reader.readAsText(file);
    });

    document.addEventListener('keydown', function (event) {
      var tag = event.target && event.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (event.key === 'ArrowLeft') selectSlide(project.activeIndex - 1);
      if (event.key === 'ArrowRight') selectSlide(project.activeIndex + 1);
    });
  }

  function start() {
    bind();
    carousel = new CS.Carousel(el.carousel, {
      onChange: function (index) {
        project.activeIndex = index;
        paintSlideList();
        paintEditor();
        scheduleSave();
      }
    });
    paintChrome();
    CS.preloadImage(project.brand.logoDataUrl).then(function () {
      refresh(true);
    });
    /* Exposed so the automated end-to-end test can drive the same code the UI uses. */
    window.carouselStudio = {
      getProject: function () { return project; },
      setProject: function (next) { replaceProject(CS.normalizeProject(next)); },
      renderSlide: function (index, width, height) {
        var format = CS.findFormat(project.formatId);
        return CS.renderOffscreen({
          project: project,
          slide: project.slides[index],
          index: index,
          total: project.slides.length,
          width: width || format.w,
          height: height || format.h
        });
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
