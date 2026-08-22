# Vithu Law — Instagram Carousels

Production system for **1080 × 1350 px** carousel slides (4:5) with the Vithu Law brand system.

## C1 — "Why small firms stay small"

Two layout options, same copy and images.

### Option A — Navy overlay (original)

Full-bleed duotone images with navy ground and bone type overlaid. Case-file exhibit stamps and filing marks.

| Slide | File |
|-------|------|
| Cover | `c1/export/c1-slide-01.png` |
| Exhibit 01–04 | `c1/export/c1-slide-02.png` – `05.png` |
| Closer | `c1/export/c1-slide-06.png` |

```bash
npm run export:c1
```

### Option B — Bone file card

Split layout: image band on top, bone parchment panel below with navy type. Red file-tab labels on the left edge.

| Slide | File |
|-------|------|
| Cover | `c1-option-b/export/c1-option-b-slide-01.png` |
| Exhibit 01–04 | `c1-option-b/export/c1-option-b-slide-02.png` – `05.png` |
| Closer | `c1-option-b/export/c1-option-b-slide-06.png` |

```bash
npm run export:c1-option-b
```

## Brand quick reference

| Token | Value |
|-------|-------|
| Ink navy | `#163646` |
| Bone | `#F2EFE7` |
| File red | `#C4392F` |

- **Display serif** — Cormorant Garamond (headlines)
- **Mono** — IBM Plex Mono (labels, CTA, signature)
- **Sans** — Source Sans 3 (body)

## Regenerate or edit

1. Edit copy or layout in `c1/index.html` and `c1/slides.css`
2. Replace source images in `c1/images/` (re-run AI prompts from the brief)
3. Export:

```bash
cd carousels
npm install
npm run export:c1
```

Output lands in `c1/export/`.

## C2 — "How to stop losing your best juniors"

Marked-up memo concept. Bone ground, navy type, red pen annotations only (no red fills). Natural-colour square images.

| Slide | File |
|-------|------|
| Cover | `c2/export/c2-slide-01.png` |
| 01–04 | `c2/export/c2-slide-02.png` – `05.png` |
| Closer | `c2/export/c2-slide-06.png` |

```bash
npm run export:c2
```

**Note:** CTA on slide 6 uses a red pen box annotation (not a solid red fill), per C2 rules.
