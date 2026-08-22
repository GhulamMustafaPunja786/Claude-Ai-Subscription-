# Vithu Law — Instagram Carousels

Production system for **1080 × 1350 px** carousel slides (4:5) with the Vithu Law brand system.

## C1 — "Why small firms stay small"

Six slides, case-file concept. All photography is AI-generated and treated with a navy/bone duotone.

| Slide | File |
|-------|------|
| Cover | `c1/export/c1-slide-01.png` |
| Exhibit 01 | `c1/export/c1-slide-02.png` |
| Exhibit 02 | `c1/export/c1-slide-03.png` |
| Exhibit 03 | `c1/export/c1-slide-04.png` |
| Exhibit 04 | `c1/export/c1-slide-05.png` |
| Closer | `c1/export/c1-slide-06.png` |

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

## C2

C2 brief not yet included — add `c2/` using the same structure when ready.
