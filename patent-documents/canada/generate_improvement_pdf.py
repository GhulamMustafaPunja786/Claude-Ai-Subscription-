#!/usr/bin/env python3
"""Generate ElecSecure Canadian Product Improvement Roadmap PDF."""

from __future__ import annotations

import re
from pathlib import Path

import cairosvg
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    HRFlowable,
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

BASE = Path(__file__).resolve().parent
DRAWINGS = BASE / "drawings"
OUT = BASE / "ElecSecure_Canadian_Improvement_Roadmap.pdf"
TMP = BASE / ".pdf_assets"
TMP.mkdir(exist_ok=True)

NAVY = colors.HexColor("#0B1D3A")
BLUE = colors.HexColor("#1A4A8A")
ACCENT = colors.HexColor("#2E7D32")
LIGHT = colors.HexColor("#F0F4F8")
BORDER = colors.HexColor("#C5D0DC")
TEXT = colors.HexColor("#1A1A2E")
MUTED = colors.HexColor("#5A6A7A")
WHITE = colors.white
CURRENT_BG = colors.HexColor("#FFF3E0")
PROPOSED_BG = colors.HexColor("#E8F5E9")
IMPACT_BG = colors.HexColor("#E3F2FD")

FIGURE_MAP: dict[int, tuple[str, str]] = {
    1: ("improvement-01-cec-certification.svg", "FIG. 12 — CEC/CSA certification pathway (current vs proposed)"),
    2: ("improvement-02-bilingual-app.svg", "FIG. 13 — Bilingual EN/FR mobile application"),
    3: ("improvement-03-cold-climate.svg", "FIG. 14 — Cold-climate hardware (−40°C rating)"),
    4: ("improvement-04-tou-rates.svg", "FIG. 15 — Canadian TOU rate integration"),
    5: ("improvement-05-greener-homes-rebate.svg", "FIG. 16 — Greener Homes rebate report export"),
    6: ("improvement-05-solar-net-metering.svg", "FIG. 17 — Solar & net metering monitoring"),
    7: ("improvement-07-green-button.svg", "FIG. 18 — Smart meter data fusion (Green Button)"),
    8: ("improvement-08-ev-charger.svg", "FIG. 19 — EV charger load management"),
    9: ("improvement-09-landlord-dashboard.svg", "FIG. 20 — Landlord multi-unit dashboard"),
    10: ("improvement-10-backup-power.svg", "FIG. 21 — Backup power safety monitoring"),
    11: ("improvement-11-electrician-pro.svg", "FIG. 22 — Electrician Pro commissioning toolkit"),
    12: ("improvement-12-pipeda.svg", "FIG. 23 — PIPEDA privacy & Canadian data residency"),
}


def esc(t: str) -> str:
    return (
        str(t)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\u2014", "&#8212;")
    )


def esc_rich(t: str) -> str:
    t = esc(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = re.sub(r"`(.+?)`", r'<font face="Courier" size="8">\1</font>', t)
    return t


def plain_text(t: str) -> str:
    return re.sub(r"\*\*(.+?)\*\*", r"\1", str(t))


def svg_to_png(svg_path: Path, scale: float = 2.5) -> Path:
    png_path = TMP / f"{svg_path.stem}.png"
    cairosvg.svg2png(url=str(svg_path), write_to=str(png_path), scale=scale)
    return png_path


def build_styles():
    base = getSampleStyleSheet()
    return {
        "cover_title": ParagraphStyle(
            "ct", fontName="Helvetica-Bold", fontSize=26, leading=32,
            textColor=WHITE, alignment=TA_CENTER, spaceAfter=8,
        ),
        "cover_sub": ParagraphStyle(
            "cs", fontName="Helvetica", fontSize=13, leading=18,
            textColor=colors.HexColor("#B0C4DE"), alignment=TA_CENTER, spaceAfter=6,
        ),
        "h1": ParagraphStyle(
            "h1", fontName="Helvetica-Bold", fontSize=15, leading=19,
            textColor=NAVY, spaceBefore=10, spaceAfter=6,
        ),
        "h2": ParagraphStyle(
            "h2", fontName="Helvetica-Bold", fontSize=12, leading=16,
            textColor=BLUE, spaceBefore=8, spaceAfter=5,
        ),
        "h3": ParagraphStyle(
            "h3", fontName="Helvetica-Bold", fontSize=10, leading=14,
            textColor=NAVY, spaceBefore=6, spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "body", fontName="Helvetica", fontSize=9.5, leading=14,
            textColor=TEXT, alignment=TA_JUSTIFY, spaceAfter=5,
        ),
        "bullet": ParagraphStyle(
            "bullet", fontName="Helvetica", fontSize=9.5, leading=14,
            textColor=TEXT, leftIndent=14, bulletIndent=4, spaceAfter=3,
        ),
        "figcap": ParagraphStyle(
            "figcap", fontName="Helvetica-Oblique", fontSize=8.5, leading=11,
            textColor=MUTED, alignment=TA_CENTER, spaceAfter=8,
        ),
        "cell": ParagraphStyle(
            "cell", fontName="Helvetica", fontSize=8.5, leading=12, textColor=TEXT,
        ),
    }


def header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    if doc.page > 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, h - 1.1 * cm, w, 1.1 * cm, fill=1, stroke=0)
        canvas.setFillColor(WHITE)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.drawString(1.5 * cm, h - 0.72 * cm, "ElecSecure — Canadian Product Improvement Roadmap")
        canvas.setFont("Helvetica", 8)
        canvas.drawRightString(w - 1.5 * cm, h - 0.72 * cm, "Azfar Mushtaq | 2026")
        canvas.setStrokeColor(BORDER)
        canvas.setLineWidth(0.4)
        canvas.line(1.5 * cm, 1.3 * cm, w - 1.5 * cm, 1.3 * cm)
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(MUTED)
        canvas.drawCentredString(w / 2, 0.85 * cm, f"Page {doc.page}")
        canvas.drawString(1.5 * cm, 0.85 * cm, "Confidential — Product Strategy")
    canvas.restoreState()


def cover_page(styles):
    story = [Spacer(1, 0.5 * cm)]
    banner = Table([[""]], colWidths=[A4[0] - 3 * cm], rowHeights=[3.5 * cm])
    banner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("BOX", (0, 0), (-1, -1), 0, NAVY),
    ]))
    story.append(banner)
    story.append(Spacer(1, -2.8 * cm))
    story.append(Paragraph("ElecSecure", styles["cover_title"]))
    story.append(Paragraph("Canadian Market Product Improvement Roadmap", styles["cover_sub"]))
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "Current State &#8594; Proposed Enhancement &#8594; Customer Impact",
        ParagraphStyle("cs2", parent=styles["cover_sub"], fontSize=11),
    ))
    story.append(Spacer(1, 1 * cm))
    meta = [
        ["Prepared for", "Azfar Mushtaq / ElecSecure"],
        ["Market", "Canada (ON, QC, BC, AB, Prairies)"],
        ["Document type", "Product strategy & blueprint guide"],
        ["Date", "September 2026"],
        ["Companion", "Canada Patent Package (CIPO)"],
    ]
    t = Table(meta, colWidths=[4.5 * cm, 10 * cm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9.5),
        ("TEXTCOLOR", (0, 0), (0, -1), BLUE),
        ("TEXTCOLOR", (1, 0), (1, -1), TEXT),
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph(
        "Twelve product improvements tailored for Canadian homeowners, landlords, and electricians — "
        "each with a current-state blueprint, proposed enhancement, and quantified market impact.",
        styles["body"],
    ))
    story.append(PageBreak())
    return story


def three_box_row(current: str, proposed: str, impact: str, styles) -> Table:
    cw = 5.5 * cm
    cells = [
        [
            Paragraph("<b>CURRENT STATE</b>", styles["h3"]),
            Paragraph("<b>PROPOSED ADDITION</b>", styles["h3"]),
            Paragraph("<b>CUSTOMER IMPACT</b>", styles["h3"]),
        ],
        [
            Paragraph(esc_rich(current), styles["cell"]),
            Paragraph(esc_rich(proposed), styles["cell"]),
            Paragraph(esc_rich(impact), styles["cell"]),
        ],
    ]
    t = Table(cells, colWidths=[cw, cw, cw])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), colors.HexColor("#E65100")),
        ("BACKGROUND", (1, 0), (1, 0), ACCENT),
        ("BACKGROUND", (2, 0), (2, 0), BLUE),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("BACKGROUND", (0, 1), (0, 1), CURRENT_BG),
        ("BACKGROUND", (1, 1), (1, 1), PROPOSED_BG),
        ("BACKGROUND", (2, 1), (2, 1), IMPACT_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def add_figure(story, svg_name: str, caption: str, styles, max_w: float = 16 * cm):
    path = DRAWINGS / svg_name
    if not path.exists():
        story.append(Paragraph(f"[Figure missing: {svg_name}]", styles["body"]))
        return
    png = svg_to_png(path)
    img = Image(str(png))
    ratio = img.imageWidth / img.imageHeight
    img.drawWidth = max_w
    img.drawHeight = max_w / ratio
    if img.drawHeight > 9.5 * cm:
        img.drawHeight = 9.5 * cm
        img.drawWidth = img.drawHeight * ratio
    story.append(Spacer(1, 4))
    story.append(img)
    story.append(Paragraph(esc(caption), styles["figcap"]))


def render_table(rows: list[list[str]], styles) -> Table:
    avail = 16.5 * cm
    nc = len(rows[0])
    cw = avail / nc
    wrapped = []
    for ri, row in enumerate(rows):
        if ri == 0:
            wrapped.append([Paragraph(f"<b>{esc(plain_text(c))}</b>", styles["cell"]) for c in row])
        else:
            wrapped.append([Paragraph(esc_rich(c), styles["cell"]) for c in row])
    t = Table(wrapped, colWidths=[cw] * nc, repeatRows=1)
    ts = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]
    for ri in range(1, len(rows)):
        if ri % 2 == 0:
            ts.append(("BACKGROUND", (0, ri), (-1, ri), WHITE))
    t.setStyle(TableStyle(ts))
    return t


def summarize_impact(rows: list[list[str]]) -> str:
    if len(rows) < 2:
        return ""
    parts = []
    for row in rows[1:4]:
        if len(row) >= 2:
            parts.append(f"<b>{plain_text(row[0])}:</b> {plain_text(row[1])}")
    return "<br/>".join(parts)


def parse_improvements(md_text: str) -> list[dict]:
    blocks = re.split(r"\n## Improvement (\d+)", md_text)
    improvements = []
    for i in range(1, len(blocks), 2):
        num = int(blocks[i])
        body = blocks[i + 1]
        title_m = re.match(r"\s*[—\-]\s*(.+?)\n", body)
        title = title_m.group(1).strip() if title_m else f"Improvement {num}"

        current_m = re.search(
            r"### Current state\n(.*?)(?=\n### )", body, re.DOTALL | re.IGNORECASE
        )
        proposed_m = re.search(
            r"### Proposed enhancement\n(.*?)(?=\n### )", body, re.DOTALL | re.IGNORECASE
        )
        impact_m = re.search(
            r"### Expected impact\n(.*?)(?=\n---|\n## |\Z)", body, re.DOTALL | re.IGNORECASE
        )

        current = current_m.group(1).strip() if current_m else ""
        proposed = proposed_m.group(1).strip() if proposed_m else ""

        impact_rows: list[list[str]] = []
        impact_summary = ""
        if impact_m:
            for line in impact_m.group(1).strip().split("\n"):
                if line.strip().startswith("|") and not re.match(r"\|[\s\-:|]+\|", line.strip()):
                    impact_rows.append([c.strip() for c in line.strip().strip("|").split("|")])
            impact_summary = summarize_impact(impact_rows)

        improvements.append({
            "num": num,
            "title": title,
            "current": current,
            "proposed": proposed,
            "impact_summary": impact_summary,
            "impact_rows": impact_rows,
        })
    return improvements


def parse_general_sections(md_text: str, styles) -> list:
    story = []
    pre = md_text.split("## Improvement 1")[0]
    lines = pre.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if s.startswith("## "):
            story.append(Paragraph(esc(s[3:]), styles["h1"]))
            story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=6))
        elif s.startswith("- ") or s.startswith("* "):
            story.append(Paragraph(esc_rich(s[2:]), styles["bullet"], bulletText="\u2022"))
        elif s.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                row = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(set(c) <= set("-:") for c in row):
                    rows.append(row)
                i += 1
            if rows:
                story.append(render_table(rows, styles))
                story.append(Spacer(1, 6))
            continue
        elif s and not s.startswith("#") and not s.startswith("**Prepared") and s != "---":
            story.append(Paragraph(esc_rich(s), styles["body"]))
        i += 1
    return story


def parse_tail_sections(md_text: str, styles) -> list:
    story = []
    tail_m = re.search(r"## Priority Roadmap.*", md_text, re.DOTALL)
    if not tail_m:
        return story
    tail = tail_m.group(0)
    parts = re.split(r"\n(## .+?)\n", tail)
    if parts:
        story.append(PageBreak())
    idx = 1
    while idx < len(parts):
        heading = parts[idx].strip()
        content = parts[idx + 1] if idx + 1 < len(parts) else ""
        story.append(Paragraph(esc(heading.replace("## ", "")), styles["h1"]))
        story.append(HRFlowable(width="100%", thickness=0.5, color=BLUE, spaceAfter=6))

        if "Priority Roadmap" in heading:
            add_figure(
                story,
                "improvement-06-roadmap-timeline.svg",
                "FIG. 24 — Phased implementation roadmap (Phase 1–3)",
                styles,
            )

        lines = content.split("\n")
        j = 0
        while j < len(lines):
            s = lines[j].strip()
            if s.startswith("### "):
                story.append(Paragraph(esc(s[4:]), styles["h2"]))
            elif s.startswith("|"):
                rows = []
                while j < len(lines) and lines[j].strip().startswith("|"):
                    row = [c.strip() for c in lines[j].strip().strip("|").split("|")]
                    if not all(set(c) <= set("-:") for c in row):
                        rows.append(row)
                    j += 1
                if rows:
                    story.append(render_table(rows, styles))
                    story.append(Spacer(1, 6))
                continue
            elif re.match(r"^\d+\.", s):
                story.append(Paragraph(esc_rich(s), styles["bullet"], bulletText="\u2022"))
            elif s and s != "---":
                story.append(Paragraph(esc_rich(s), styles["body"]))
            j += 1
        idx += 2
    return story


def build_story(md_path: Path, styles) -> list:
    md_text = md_path.read_text(encoding="utf-8")
    story = cover_page(styles)
    story.extend(parse_general_sections(md_text, styles))
    story.append(PageBreak())

    improvements = parse_improvements(md_text)
    for imp in improvements:
        n = imp["num"]
        story.append(Paragraph(
            esc(f"Improvement {n} — {imp['title']}"),
            styles["h1"],
        ))
        story.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceAfter=8))

        impact_text = imp["impact_summary"] or "See impact metrics table below."
        story.append(three_box_row(imp["current"], imp["proposed"], impact_text, styles))
        story.append(Spacer(1, 6))

        if n in FIGURE_MAP:
            svg, cap = FIGURE_MAP[n]
            add_figure(story, svg, cap, styles)

        if imp["impact_rows"]:
            story.append(Paragraph("Expected Impact Metrics", styles["h3"]))
            story.append(render_table(imp["impact_rows"], styles))

        if n < len(improvements):
            story.append(PageBreak())

    story.extend(parse_tail_sections(md_text, styles))
    return story


def main():
    styles = build_styles()
    md = BASE / "06_CANADIAN_PRODUCT_IMPROVEMENT_ROADMAP.md"
    if not md.exists():
        raise SystemExit(f"Missing {md}")

    story = build_story(md, styles)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.6 * cm,
        bottomMargin=1.6 * cm,
        title="ElecSecure Canadian Product Improvement Roadmap",
        author="Azfar Mushtaq",
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    size_kb = OUT.stat().st_size // 1024
    print(f"Generated: {OUT} ({size_kb} KB, {len(story)} flowables)")


if __name__ == "__main__":
    main()
