/* Project state: the single source of truth for the whole app.
   Persisted to localStorage so a refresh never loses work. */
window.CS = window.CS || {};

CS.STORAGE_KEY = 'carousel-studio:project:v1';
CS.PROJECT_VERSION = 1;

CS.uid = function () {
  return 's' + Math.random().toString(36).slice(2, 9);
};

CS.newSlide = function (layout, fields) {
  var slide = {
    id: CS.uid(),
    layout: layout || 'text',
    eyebrow: '',
    heading: '',
    body: ''
  };
  return Object.assign(slide, fields || {});
};

CS.newProject = function () {
  return {
    version: CS.PROJECT_VERSION,
    name: 'Untitled carousel',
    formatId: 'portrait',
    themeId: 'midnight',
    fontId: 'sans',
    background: 'gradient',
    brand: {
      handle: '@yourbrand',
      ctaText: 'Follow for more',
      logoDataUrl: '',
      showPageNumbers: true,
      showSwipeHint: true,
      showHandle: true
    },
    caption: '',
    slides: [CS.newSlide('cover')],
    activeIndex: 0
  };
};

/* Anything loaded from disk or localStorage goes through this so a missing or
   renamed field can never break the renderer. */
CS.normalizeProject = function (raw) {
  var base = CS.newProject();
  if (!raw || typeof raw !== 'object') return base;

  var project = {
    version: CS.PROJECT_VERSION,
    name: typeof raw.name === 'string' ? raw.name : base.name,
    formatId: CS.findFormat(raw.formatId).id,
    themeId: CS.findTheme(raw.themeId).id,
    fontId: CS.findFont(raw.fontId).id,
    background: CS.BACKGROUNDS.some(function (b) { return b.id === raw.background; }) ? raw.background : base.background,
    brand: Object.assign({}, base.brand, raw.brand || {}),
    caption: typeof raw.caption === 'string' ? raw.caption : '',
    slides: [],
    activeIndex: 0
  };

  var slides = Array.isArray(raw.slides) ? raw.slides : [];
  project.slides = slides.map(function (s) {
    var layout = CS.LAYOUTS.some(function (l) { return l.id === (s && s.layout); }) ? s.layout : 'text';
    return CS.newSlide(layout, {
      eyebrow: s && typeof s.eyebrow === 'string' ? s.eyebrow : '',
      heading: s && typeof s.heading === 'string' ? s.heading : '',
      body: s && typeof s.body === 'string' ? s.body : ''
    });
  });
  if (!project.slides.length) project.slides = [CS.newSlide('cover')];

  var index = Number(raw.activeIndex);
  project.activeIndex = Number.isInteger(index) && index >= 0 && index < project.slides.length ? index : 0;
  return project;
};

CS.saveLocal = function (project) {
  try {
    window.localStorage.setItem(CS.STORAGE_KEY, JSON.stringify(project));
    return true;
  } catch (err) {
    return false;
  }
};

CS.loadLocal = function () {
  try {
    var raw = window.localStorage.getItem(CS.STORAGE_KEY);
    return raw ? CS.normalizeProject(JSON.parse(raw)) : null;
  } catch (err) {
    return null;
  }
};

CS.clearLocal = function () {
  try { window.localStorage.removeItem(CS.STORAGE_KEY); } catch (err) { /* private mode */ }
};

/* Turns "1 Slide title" into a filesystem-safe file name stem. */
CS.slugify = function (text, fallback) {
  var slug = String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug || fallback || 'carousel';
};
