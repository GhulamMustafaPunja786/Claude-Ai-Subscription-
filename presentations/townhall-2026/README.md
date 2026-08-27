# ElecSecure Town Hall Presentation Pack

Professional materials for the **Annual Town Hall 2026** presentation.

## Contents

| File | Purpose |
|------|---------|
| `ElecSecure-Townhall-2026.pptx` | 17-slide PowerPoint deck (ready to present) |
| `ElecSecure-Project-Blueprint.md` | Master project blueprint and stakeholder reference |
| `Speaker-Notes.md` | Slide-by-slide script, Q&A prep, and delivery tips |
| `One-Page-Executive-Summary.md` | Printable handout for leadership and attendees |
| `generate_presentation.py` | Script to regenerate the PPTX if content changes |

## Recommended presentation flow

1. **Duration:** 20–25 minutes + 10 minutes Q&A
2. **Audience:** Mixed (technical + non-technical)
3. **Tone:** Professional, outcome-focused, inclusive
4. **Key message:** *Safety • Savings • Control*

## How to use

1. Review `Speaker-Notes.md` before the town hall
2. Present `ElecSecure-Townhall-2026.pptx`
3. Share `ElecSecure-Project-Blueprint.md` with stakeholders who want detail
4. Distribute `One-Page-Executive-Summary.md` as a takeaway

## Regenerating the deck

```bash
pip install python-pptx
python3 presentations/townhall-2026/generate_presentation.py
```

## Expert additions included

- Mixed-audience messaging (non-project staff friendly)
- Stakeholder value matrix in blueprint
- Risk & mitigation slide for leadership credibility
- Clear call-to-action slide
- Speaker notes embedded in every PPT slide
