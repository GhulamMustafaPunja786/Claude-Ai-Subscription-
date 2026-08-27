# ElecSecure Town Hall Presentation Pack (Complete)

Professional materials for the **Annual Town Hall 2026** — ready to present.

## Quick Start — Which file to use?

| Your situation | Open this file | Duration |
|----------------|----------------|----------|
| **Full town hall** (recommended) | `ElecSecure-Townhall-2026-Full.pptx` | 20–25 min + Q&A |
| **Short time slot** | `ElecSecure-Townhall-2026-10-Slides.pptx` | 12–15 min + Q&A |
| **Executive / leadership only** | `ElecSecure-Townhall-2026-Executive-5min.pptx` | 5 min |
| **Printable handout** | `ElecSecure-Executive-OnePager.pdf` | Give to attendees |

## All files

| File | Purpose |
|------|---------|
| `ElecSecure-Townhall-2026-Full.pptx` | 17-slide branded deck with logo + demo callout |
| `ElecSecure-Townhall-2026-10-Slides.pptx` | Condensed 10-slide version |
| `ElecSecure-Townhall-2026-Executive-5min.pptx` | 5-slide executive briefing |
| `ElecSecure-Townhall-2026.pptx` | Alias of full deck |
| `ElecSecure-Project-Blueprint.md` | Master project blueprint |
| `Speaker-Notes.md` | Full slide-by-slide script |
| `Live-Demo-Script.md` | 90-second mobile app demo script |
| `Rehearsal-Guide.md` | Practice guide for key slides 6, 11, 12 |
| `One-Page-Executive-Summary.md` | Markdown handout |
| `ElecSecure-Executive-OnePager.pdf` | Printable PDF handout |
| `assets/elecsecure-logo.png` | Brand logo (large) |
| `assets/elecsecure-logo-small.png` | Brand logo (slide header) |

## Before you present

1. Read `Rehearsal-Guide.md` — focus on slides 6, 11, 12
2. Practice the 90-second demo in `Live-Demo-Script.md`
3. Print `ElecSecure-Executive-OnePager.pdf` for executives
4. Choose the right deck for your time slot (see table above)

## Regenerate everything

```bash
cd presentations/townhall-2026
pip install python-pptx pillow reportlab
python3 assets/create_logo.py
python3 generate_all.py
python3 generate_onepager_pdf.py
```

Generate a specific variant:
```bash
python3 generate_all.py --variant short      # 10-slide only
python3 generate_all.py --variant executive  # 5-slide only
python3 generate_all.py --variant full       # 17-slide only
```

## Branding included

- ElecSecure shield + lightning logo on all slides
- Navy / electric blue / teal colour scheme
- Live demo callout on "How It Works" slide
- Speaker notes embedded in every slide

## Key message

**Safety • Savings • Control**
