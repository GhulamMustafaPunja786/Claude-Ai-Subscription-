/* Formats, themes, fonts and layout definitions.
   Everything is authored in a 1080px-wide design space; the renderer scales it. */
window.CS = window.CS || {};

CS.FORMATS = [
  { id: 'portrait', label: 'Portrait 4:5 — 1080 x 1350 (Instagram + LinkedIn)', w: 1080, h: 1350 },
  { id: 'square', label: 'Square 1:1 — 1080 x 1080 (Instagram)', w: 1080, h: 1080 },
  { id: 'story', label: 'Story 9:16 — 1080 x 1920 (Stories / Reels cover)', w: 1080, h: 1920 },
  { id: 'landscape', label: 'Landscape 4:3 — 1200 x 900 (LinkedIn PDF, slides)', w: 1200, h: 900 }
];

CS.THEMES = [
  { id: 'midnight', label: 'Midnight', bg: '#0B1220', bg2: '#152036', text: '#F8FAFC', muted: '#93A3B8', accent: '#22D3EE', accentText: '#04141A' },
  { id: 'ink', label: 'Ink', bg: '#101010', bg2: '#1F1F1F', text: '#FFFFFF', muted: '#A3A3A3', accent: '#FACC15', accentText: '#1A1600' },
  { id: 'paper', label: 'Paper', bg: '#F8F5EF', bg2: '#EBE4D8', text: '#1B1B1B', muted: '#6B6257', accent: '#C2410C', accentText: '#FFF7ED' },
  { id: 'mint', label: 'Mint', bg: '#052E2B', bg2: '#064E3B', text: '#ECFDF5', muted: '#8FC9B6', accent: '#34D399', accentText: '#03251F' },
  { id: 'grape', label: 'Grape', bg: '#1E1B4B', bg2: '#3B0764', text: '#F5F3FF', muted: '#B3AEE0', accent: '#C4B5FD', accentText: '#241A4D' },
  { id: 'sunrise', label: 'Sunrise', bg: '#FFF7ED', bg2: '#FFE4E6', text: '#431407', muted: '#8A5A3B', accent: '#EA580C', accentText: '#FFF7ED' },
  { id: 'steel', label: 'Steel', bg: '#F1F5F9', bg2: '#DCE3EC', text: '#0F172A', muted: '#5A6B82', accent: '#2563EB', accentText: '#F8FAFF' },
  { id: 'power', label: 'Power', bg: '#1A0A0A', bg2: '#2E0B0B', text: '#FFF1F2', muted: '#C89A9A', accent: '#EF4444', accentText: '#FFF1F2' }
];

CS.FONTS = [
  { id: 'sans', label: 'Modern sans', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { id: 'grotesk', label: 'Grotesk', stack: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: 'serif', label: 'Editorial serif', stack: 'Georgia, "Times New Roman", "Liberation Serif", serif' },
  { id: 'display', label: 'Heavy display', stack: '"Arial Black", "Archivo Black", Impact, "DejaVu Sans", sans-serif' },
  { id: 'mono', label: 'Mono', stack: '"SFMono-Regular", Consolas, "Liberation Mono", "Roboto Mono", monospace' }
];

CS.LAYOUTS = [
  { id: 'cover', label: 'Cover (hook)' },
  { id: 'text', label: 'Headline + text' },
  { id: 'bullets', label: 'Checklist / bullets' },
  { id: 'quote', label: 'Quote' },
  { id: 'stat', label: 'Big number' },
  { id: 'cta', label: 'Call to action' }
];

CS.BACKGROUNDS = [
  { id: 'gradient', label: 'Soft gradient' },
  { id: 'solid', label: 'Solid colour' },
  { id: 'glow', label: 'Accent glow' },
  { id: 'block', label: 'Accent corner block' }
];

CS.findFormat = function (id) { return CS.FORMATS.find(function (f) { return f.id === id; }) || CS.FORMATS[0]; };
CS.findTheme = function (id) { return CS.THEMES.find(function (t) { return t.id === id; }) || CS.THEMES[0]; };
CS.findFont = function (id) { return CS.FONTS.find(function (f) { return f.id === id; }) || CS.FONTS[0]; };
