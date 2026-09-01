#!/usr/bin/env python3
"""Generate improved ElecSecure Canadian patent package PDF with visuals."""

from __future__ import annotations

import re
from pathlib import Path

import cairosvg
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

BASE = Path(__file__).resolve().parent
DRAWINGS = BASE / "drawings"
OUTPUT = BASE / "ElecSecure_Canada_Patent_Package.pdf"
TMP = BASE / ".pdf_assets"
TMP.mkdir(exist_ok=True)

# Brand palette
NAVY = colors.HexColor("#1a365d")
BLUE = colors.HexColor("#2b6cb0")
TEAL = colors.HexColor("#276749")
PURPLE = colors.HexColor("#6b46c1")
ORANGE = colors.HexColor("#c05621")
LIGHT = colors.HexColor("#f7fafc")
BORDER = colors.HexColor("#cbd5e0")
MUTED = colors.HexColor("#4a5568")
RED = colors.HexColor("#c53030")

PAGE_W, PAGE_H = A4
MARGIN_L = 2 * cm
MARGIN_R = 2 * cm
MARGIN_T = 2.4 * cm
MARGIN_B = 2.2 * cm


class PatentDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, pagesize=A4, **kwargs)
        frame = Frame(
            MARGIN_L, MARGIN_B,
            PAGE_W - MARGIN_L - MARGIN_R,
            PAGE_H - MARGIN_T - MARGIN_B,
            id="main",
        )
        self.addPageTemplates([
            PageTemplate(id="content", frames=[frame], onPage=self._content_page),
        ])
        self._section_title = ""

    def _content_page(self, canv: canvas.Canvas, doc):
        if canv.getPageNumber() == 1:
            return
        canv.saveState()
        # Header bar
        canv.setFillColor(NAVY)
        canv.rect(0, PAGE_H - 1.4 * cm, PAGE_W, 1.4 * cm, fill=1, stroke=0)
        canv.setFillColor(colors.white)
        canv.setFont("Helvetica-Bold", 9)
        canv.drawString(MARGIN_L, PAGE_H - 0.95 * cm, "ELECSECURE — Canadian Patent Application (CIPO Draft)")
        if self._section_title:
            canv.setFont("Helvetica", 8)
            canv.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 0.95 * cm, self._section_title[:60])
        # Footer
        canv.setStrokeColor(BORDER)
        canv.setLineWidth(0.5)
        canv.line(MARGIN_L, 1.5 * cm, PAGE_W - MARGIN_R, 1.5 * cm)
        canv.setFillColor(MUTED)
        canv.setFont("Helvetica", 8)
        canv.drawString(MARGIN_L, 1.0 * cm, "Azfar Mushtaq | Draft v2.2 | Not filed with CIPO")
        canv.drawRightString(PAGE_W - MARGIN_R, 1.0 * cm, f"Page {canv.getPageNumber()}")
        canv.restoreState()

    def afterFlowable(self, flowable):
        pass


def svg_to_png(svg_path: Path, scale: float = 3.0) -> Path:
    png_path = TMP / f"{svg_path.stem}.png"
    cairosvg.svg2png(url=str(svg_path), write_to=str(png_path), scale=scale)
    return png_path


def plain_text(text: str) -> str:
    """Strip markdown formatting for table cells and plain strings."""
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"`(.+?)`", r"\1", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    return text.strip()


def esc_rich(text: str) -> str:
    """Escape text for Paragraphs, preserving **bold** markdown."""
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`(.+?)`", r"<font face='Courier' size='9'>\1</font>", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    text = text.replace("&", "&amp;")
    parts = re.split(r"(<[^>]+>)", text)
    out = []
    for part in parts:
        if part.startswith("<") and part.endswith(">"):
            out.append(part)
        else:
            out.append(part.replace("<", "&lt;").replace(">", "&gt;"))
    return "".join(out)


def esc(text: str) -> str:
    text = plain_text(text)
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;").replace(">", "&gt;")
    return text


def table_cell(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(esc(text), style)


def professional_table(
    styles,
    data: list[list[str]],
    col_widths: list[float],
    header_color=NAVY,
    center_cols: set[int] | None = None,
    mono_cols: set[int] | None = None,
    highlight_col: int | None = None,
    has_header: bool = True,
):
    """Build a word-wrapping table with Paragraph cells (no raw HTML leakage)."""
    center_cols = center_cols or set()
    mono_cols = mono_cols or set()

    cell_left = ParagraphStyle(
        "TblCellL", parent=styles["Body"], fontSize=8.5, leading=11.5,
        alignment=TA_LEFT, wordWrap="CJK",
    )
    cell_center = ParagraphStyle(
        "TblCellC", parent=cell_left, alignment=TA_CENTER,
    )
    cell_mono = ParagraphStyle(
        "TblCellM", parent=cell_left, fontName="Courier", fontSize=7.5, leading=10,
    )
    cell_header = ParagraphStyle(
        "TblCellH", parent=cell_left, fontName="Helvetica-Bold",
        fontSize=8.5, leading=11, textColor=colors.white, alignment=TA_CENTER,
    )
    cell_header_left = ParagraphStyle(
        "TblCellHL", parent=cell_header, alignment=TA_LEFT,
    )

    rows: list[list[Paragraph]] = []
    for r_idx, row in enumerate(data):
        prow: list[Paragraph] = []
        for c_idx, cell in enumerate(row):
            if r_idx == 0 and has_header:
                pstyle = cell_header_left if c_idx == 0 else cell_header
            elif c_idx in mono_cols:
                pstyle = cell_mono
            elif c_idx in center_cols:
                pstyle = cell_center
            else:
                pstyle = cell_left
            prow.append(table_cell(cell, pstyle))
        rows.append(prow)

    t = Table(rows, colWidths=col_widths, repeatRows=1 if has_header else 0)
    style_cmds = [
        ("ROWBACKGROUNDS", (0, 0 if not has_header else 1), (-1, -1), [colors.white, LIGHT]),
        ("BOX", (0, 0), (-1, -1), 0.75, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]
    if has_header:
        style_cmds.insert(0, ("BACKGROUND", (0, 0), (-1, 0), header_color))
    else:
        style_cmds.extend([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#edf2f7")),
        ])
    if highlight_col is not None:
        style_cmds.append(
            ("BACKGROUND", (highlight_col, 1), (highlight_col, -1), colors.HexColor("#f0fff4"))
        )
        style_cmds.append(
            ("FONTNAME", (highlight_col, 1), (highlight_col, -1), "Helvetica-Bold")
        )
    t.setStyle(TableStyle(style_cmds))
    return t


def styled_table(data, col_widths, header_color=NAVY):
    """Legacy wrapper - prefer professional_table with styles."""
    tmp_styles = build_styles()
    plain = [[plain_text(str(c)) for c in row] for row in data]
    center = set(range(1, len(plain[0]))) if plain else set()
    return professional_table(tmp_styles, plain, col_widths, header_color, center_cols=center)


def build_styles():
    s = getSampleStyleSheet()
    defs = [
        ("CoverTitle", dict(parent=s["Title"], fontSize=28, leading=34, alignment=TA_CENTER,
                            spaceAfter=12, textColor=NAVY, fontName="Helvetica-Bold")),
        ("CoverSub", dict(parent=s["Normal"], fontSize=12, leading=17, alignment=TA_CENTER,
                          spaceAfter=6, textColor=MUTED)),
        ("CoverTag", dict(parent=s["Normal"], fontSize=10, leading=14, alignment=TA_CENTER,
                          textColor=colors.white, backColor=BLUE)),
        ("SectionHead", dict(parent=s["Heading1"], fontSize=17, leading=22, spaceBefore=6,
                             spaceAfter=12, textColor=NAVY, fontName="Helvetica-Bold")),
        ("SectionBanner", dict(parent=s["Heading1"], fontSize=22, leading=28, alignment=TA_CENTER,
                               textColor=colors.white, spaceBefore=80, spaceAfter=20)),
        ("SubHead", dict(parent=s["Heading2"], fontSize=12, leading=16, spaceBefore=10,
                         spaceAfter=6, textColor=BLUE, fontName="Helvetica-Bold")),
        ("Body", dict(parent=s["Normal"], fontSize=10, leading=15, alignment=TA_JUSTIFY, spaceAfter=6)),
        ("BodyBullet", dict(parent=s["Normal"], fontSize=10, leading=14, leftIndent=16, spaceAfter=4)),
        ("Claim", dict(parent=s["Normal"], fontSize=10, leading=14, leftIndent=20,
                       firstLineIndent=-12, spaceAfter=8, alignment=TA_JUSTIFY)),
        ("ClaimSub", dict(parent=s["Normal"], fontSize=10, leading=14, leftIndent=36,
                          firstLineIndent=-12, spaceAfter=4)),
        ("Caption", dict(parent=s["Normal"], fontSize=9, leading=13, alignment=TA_CENTER,
                         textColor=MUTED, spaceAfter=8)),
        ("FigureTitle", dict(parent=s["Heading2"], fontSize=14, leading=18, alignment=TA_CENTER,
                             textColor=NAVY, fontName="Helvetica-Bold", spaceAfter=6)),
        ("Disclaimer", dict(parent=s["Normal"], fontSize=9, leading=13, textColor=RED, spaceAfter=6)),
        ("TOCSub", dict(parent=s["Normal"], fontSize=10, leading=14, leftIndent=20, spaceAfter=3)),
        ("TOCEntry0", dict(parent=s["Normal"], fontSize=11, leading=16, leftIndent=0,
                           spaceBefore=4, fontName="Helvetica-Bold", textColor=NAVY)),
        ("TOCEntry1", dict(parent=s["Normal"], fontSize=10, leading=14, leftIndent=20, spaceAfter=2)),
        ("Small", dict(parent=s["Normal"], fontSize=8, leading=11, textColor=MUTED)),
    ]
    for name, kw in defs:
        if name not in s:
            s.add(ParagraphStyle(name=name, **kw))
    return s


def section_divider(styles, number: str, title: str):
    banner = Table([[f"SECTION {number}", title]], colWidths=[3.5 * cm, 12 * cm])
    banner.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (0, 0), 11),
        ("FONTSIZE", (1, 0), (1, 0), 14),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return [Spacer(1, 0.3 * cm), banner, Spacer(1, 0.4 * cm)]


def add_cover(story, styles):
    # Top accent bar simulated via table
    accent = Table([[""]], colWidths=[16 * cm], rowHeights=[0.5 * cm])
    accent.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), NAVY)]))
    story.append(accent)
    story.append(Spacer(1, 2.5 * cm))
    story.append(Paragraph("ELECSECURE", styles["CoverTitle"]))
    story.append(Paragraph("Canadian Patent Application Package", styles["CoverSub"]))
    story.append(Spacer(1, 0.4 * cm))

    tag = Table([["CIPO DRAFT - VERSION 2.2"]], colWidths=[8 * cm])
    tag.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BLUE),
        ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(tag)
    story.append(Spacer(1, 1 * cm))

    story.append(Paragraph(
        "<b>SMART ELECTRICAL SAFETY AND ENERGY EFFICIENCY<br/>"
        "MANAGEMENT SYSTEM WITH IoT-ENABLED ARC FAULT<br/>"
        "PROTECTION AND INTEGRATED CLOUD ANALYTICS</b>",
        styles["CoverSub"],
    ))
    story.append(Spacer(1, 1.2 * cm))

    meta = [
        ["Applicant / Inventor", "Azfar Mushtaq"],
        ["Jurisdiction", "Canada — CIPO (ISED)"],
        ["Document version", "Draft 2.0 — September 2026"],
        ["Patent claims", "20 (device, system, method)"],
        ["Technical figures", "11 drawings"],
        ["IPC classification", "H02H 3/00, H02H 1/00, H04Q 9/00"],
    ]
    story.append(professional_table(styles, meta, [5.5 * cm, 9.5 * cm], has_header=False))
    story.append(Spacer(1, 0.8 * cm))

    highlights = [
        ["Arc fault detection &amp; extinguishing", "Dual thermal-magnetic tripping"],
        ["IoT cloud analytics + ML", "2-module compact DIN form factor"],
        ["Mobile remote control", "Smart-home integration"],
    ]
    h = Table(highlights, colWidths=[7.5 * cm, 7.5 * cm])
    h.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
        ("TEXTCOLOR", (0, 0), (-1, -1), NAVY),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(h)
    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph(
        "<b>Important:</b> Technical draft for review by a registered Canadian patent agent. "
        "Not legal advice. Not filed with CIPO.",
        styles["Disclaimer"],
    ))
    story.append(PageBreak())


def add_executive_summary(story, styles):
    story.append(Paragraph("Executive Summary", styles["SectionHead"]))
    story.append(Paragraph(
        "ElecSecure is an integrated smart electrical safety and energy efficiency management "
        "system designed for residential and commercial installations in Canada. The invention "
        "combines a compact IoT-enabled circuit protection device with arc fault detection, "
        "active arc extinguishing, dual tripping mechanisms, and cloud-connected analytics "
        "delivered through a mobile application.",
        styles["Body"],
    ))
    story.append(Spacer(1, 0.3 * cm))

    # Feature cards as table
    cards = [
        ["Safety Innovation", "Energy Intelligence", "Connected Control"],
        ["Arc fault detection\nArc chamber extinguishing\nContinuous self-test\n6/10 kA breaking capacity",
         "Real-time consumption monitoring\nML efficiency recommendations\nPower quality analytics\nHistorical trend reports",
         "Wi-Fi / BLE connectivity\nRemote trip & reset\nPush alerts\nSmart-home API integration"],
    ]
    ct = Table(cards, colWidths=[5.2 * cm, 5.2 * cm, 5.2 * cm], rowHeights=[None, 2.8 * cm])
    ct.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), BLUE),
        ("BACKGROUND", (1, 0), (1, 0), TEAL),
        ("BACKGROUND", (2, 0), (2, 0), PURPLE),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("FONTSIZE", (0, 1), (-1, 1), 8.5),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
        ("BACKGROUND", (0, 1), (-1, 1), LIGHT),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(ct)
    story.append(Spacer(1, 0.5 * cm))

    # Invention overview figure
    png = svg_to_png(DRAWINGS / "figure-09-invention-overview.svg")
    img = Image(str(png), width=15 * cm, height=10.3 * cm)
    story.append(img)
    story.append(Paragraph(
        "<b>FIG. 9</b> — Invention overview showing integrated system (100) with core device (102), "
        "cloud platform (106), and mobile application (108).",
        styles["Caption"],
    ))
    story.append(PageBreak())


def add_competitive_table(story, styles):
    story.append(Paragraph("Competitive Differentiation", styles["SectionHead"]))
    story.append(Paragraph(
        "The following comparison illustrates how ElecSecure differs from conventional solutions "
        "in the electrical protection and energy management market.",
        styles["Body"],
    ))
    story.append(Spacer(1, 0.2 * cm))
    data = [
        ["Feature", "Conventional Breaker", "Smart Meter Only", "ElecSecure (Invention)"],
        ["Arc fault extinguishing chamber", "No", "No", "Yes"],
        ["Dual thermal + magnetic tripping", "Partial", "No", "Yes"],
        ["Compact 2-module form factor", "Varies", "N/A", "Yes (36 mm)"],
        ["Continuous self-test + LED diagnostics", "Rare", "No", "Yes"],
        ["Real-time mobile alerts", "No", "Limited", "Yes"],
        ["Remote trip / reset control", "No", "No", "Yes"],
        ["ML energy recommendations", "No", "Basic", "Yes"],
        ["Smart-home integration", "No", "Limited", "Yes"],
        ["Bidirectional power connection", "Rare", "N/A", "Yes"],
    ]
    story.append(professional_table(
        styles, data,
        col_widths=[6.4 * cm, 3.0 * cm, 3.0 * cm, 3.1 * cm],
        header_color=TEAL,
        center_cols={1, 2, 3},
        highlight_col=3,
    ))
    story.append(PageBreak())


def add_toc(story, styles):
    story.append(Paragraph("Table of Contents", styles["SectionHead"]))
    story.append(Spacer(1, 0.3 * cm))
    items = [
        ("Executive Summary &amp; Invention Overview", ""),
        ("Competitive Differentiation", ""),
        ("Section I - Filing Guide &amp; Checklist", ""),
        ("Section II - Petition for a Patent", ""),
        ("Section III - Abstract", ""),
        ("Section IV - Description of the Invention", ""),
        ("Section V - Claims (1-20)", ""),
        ("Section VI - Technical Drawings &amp; Reference Numerals", ""),
        ("Figure 1 - System Architecture", ""),
        ("Figure 2 - Device Front Elevation", ""),
        ("Figure 3 - Arc Extinguishing Subsystem", ""),
        ("Figure 4 - Internal Electronics Block Diagram", ""),
        ("Figure 5 - Local Fault Detection Flowchart", ""),
        ("Figure 6 - Cloud Processing Flowchart", ""),
        ("Figure 7 - Dual Tripping Mechanism", ""),
        ("Figure 8 - Mobile Application Interface", ""),
        ("Figure 9 - Invention Overview Diagram", ""),
        ("Figure 10 - Panel Installation Blueprint", ""),
        ("Bill of Materials &amp; Electrical Specifications", ""),
        ("CIPO Filing Roadmap &amp; Fee Schedule", ""),
        ("Applicant Declaration &amp; Signature", ""),
    ]
    rows = [[Paragraph(esc(title), styles["Body"]), ""] for title, _ in items]
    toc_table = Table(rows, colWidths=[13 * cm, 2.5 * cm])
    toc_table.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -2), 0.25, colors.HexColor("#e2e8f0")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(toc_table)
    story.append(PageBreak())


def parse_markdown_table_row(line: str) -> list[str] | None:
    if not line.startswith("|"):
        return None
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    return cells if cells else None


def is_table_separator(cells: list[str]) -> bool:
    return all(re.match(r"^:?-+:?$", c.replace(" ", "")) for c in cells)


def add_markdown_table(story, styles, rows: list[list[str]]):
    if not rows:
        return
    ncols = max(len(r) for r in rows)
    rows = [r + [""] * (ncols - len(r)) for r in rows]
    plain_rows = [[plain_text(c) for c in row] for row in rows]

    if ncols == 3:
        widths = [4.8 * cm, 4.6 * cm, 6.1 * cm]
        mono_cols = {0}
    elif ncols == 2:
        widths = [5.5 * cm, 10.0 * cm]
        mono_cols = set()
    elif ncols == 4:
        widths = [3.2 * cm, 3.2 * cm, 3.2 * cm, 5.9 * cm]
        mono_cols = set()
    else:
        widths = [15.5 * cm / ncols] * ncols
        mono_cols = set()

    story.append(professional_table(
        styles, plain_rows, widths,
        header_color=NAVY,
        center_cols=set(range(1, ncols)),
        mono_cols=mono_cols,
    ))
    story.append(Spacer(1, 0.3 * cm))


def add_markdown_full(story, styles, title: str, md_path: Path, skip_h1: bool = True, include_title: bool = True):
    if include_title:
        story.append(Paragraph(title, styles["SectionHead"]))
    lines = md_path.read_text(encoding="utf-8").splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()

        if not stripped or stripped.startswith("---"):
            i += 1
            continue

        if skip_h1 and stripped.startswith("# ") and not stripped.startswith("## "):
            i += 1
            continue

        if stripped.startswith("|"):
            table_rows: list[list[str]] = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = parse_markdown_table_row(lines[i].strip())
                if cells and not is_table_separator(cells):
                    table_rows.append(cells)
                i += 1
            add_markdown_table(story, styles, table_rows)
            continue

        if stripped.startswith("## "):
            story.append(Paragraph(esc_rich(stripped[3:]), styles["SubHead"]))
        elif stripped.startswith("### "):
            story.append(Paragraph(esc_rich(stripped[4:]), styles["SubHead"]))
        elif stripped.startswith("- ") or stripped.startswith("* ") or stripped.startswith("➢ "):
            content = stripped.lstrip("-*➢ ").strip()
            story.append(Paragraph("• " + esc_rich(content), styles["BodyBullet"]))
        elif re.match(r"^\d+\.", stripped):
            story.append(Paragraph(esc_rich(stripped), styles["BodyBullet"]))
        elif stripped.startswith("#"):
            pass
        else:
            story.append(Paragraph(esc_rich(stripped), styles["Body"]))
        i += 1

    story.append(PageBreak())


def add_claims(story, styles, include_title: bool = True):
    if include_title:
        story.append(Paragraph("Claims", styles["SectionHead"]))
    story.append(Paragraph(
        "What is claimed is:", styles["Body"],
    ))
    text = (BASE / "04_CLAIMS.md").read_text(encoding="utf-8")
    claim_blocks = re.split(r"\n(?=\d+\.\s)", text)
    for block in claim_blocks:
        block = block.strip()
        if not block or block.startswith("#") or block.startswith("---") or block.startswith("**Total"):
            continue
        m = re.match(r"^(\d+)\.\s*(.*)", block, re.DOTALL)
        if not m:
            continue
        num, body = m.group(1), m.group(2).strip()
        lines = body.split("\n")
        first = lines[0].strip()
        story.append(Paragraph(f"<b>{num}.</b> {esc(first)}", styles["Claim"]))
        for sub in lines[1:]:
            sub = sub.strip()
            if sub.startswith("- "):
                story.append(Paragraph("• " + esc(sub[2:]), styles["ClaimSub"]))
    story.append(PageBreak())


def add_figure_page(story, styles, fig_num: int, title: str, caption: str, svg_name: str,
                    width_cm: float = 15.5, height_cm: float | None = None):
    story.append(Paragraph(f"FIGURE {fig_num}", styles["FigureTitle"]))
    story.append(Paragraph(title, styles["Caption"]))
    story.append(Spacer(1, 0.3 * cm))

    png = svg_to_png(DRAWINGS / svg_name)
    img = Image(str(png))
    max_w = width_cm * cm
    max_h = (height_cm or 19) * cm
    if height_cm:
        img.drawWidth = max_w
        img.drawHeight = height_cm * cm
    else:
        ratio = min(max_w / img.drawWidth, max_h / img.drawHeight)
        img.drawWidth = img.drawWidth * ratio
        img.drawHeight = img.drawHeight * ratio

    framed = Table([[img]], colWidths=[16.5 * cm])
    framed.setStyle(TableStyle([
        ("BOX", (0, 0), (-1, -1), 1, BORDER),
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(framed)
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph(f"<b>FIG. {fig_num}</b> - {esc(caption)}", styles["Caption"]))
    story.append(PageBreak())


def add_blueprints_summary(story, styles):
    story.append(Paragraph("Technical Blueprints &amp; Reference Numerals", styles["SectionHead"]))
    refs = [
        ["Numeral", "Element Description"],
        ["100", "Smart electrical safety and energy efficiency management system"],
        ["102", "ElecSecure IoT-enabled protection device"],
        ["104", "Local network (Wi-Fi / LAN)"],
        ["106", "Cloud-based data platform"],
        ["108", "Mobile application"],
        ["110", "Smart-home devices"],
        ["202", "Device enclosure (two-module DIN)"],
        ["204/206", "Bidirectional input/output terminals"],
        ["208", "LED fault indicators"],
        ["300", "Arc extinguishing subsystem"],
        ["302", "Arc runners"],
        ["304", "Pre-chamber plates"],
        ["306", "Arc chamber"],
        ["308", "Arc sensors"],
        ["402", "Microcontroller"],
        ["404", "Delayed thermal tripping mechanism"],
        ["406", "Magnetic tripping mechanism"],
        ["408", "Sensor array (current, voltage, temperature)"],
        ["410", "Connectivity module (Wi-Fi / BLE)"],
        ["412", "Power supply"],
        ["414", "Non-volatile memory (firmware, logs)"],
        ["500", "Local fault detection process"],
        ["600", "Cloud processing process"],
        ["612", "Machine-learning module"],
        ["802–814", "Mobile application UI panels"],
    ]
    story.append(professional_table(styles, refs, [2.8 * cm, 12.7 * cm], mono_cols={0}))
    story.append(PageBreak())


def add_bom_and_specs(story, styles):
    story.append(Paragraph("Bill of Materials &amp; Electrical Specifications", styles["SectionHead"]))
    specs = [
        ["Parameter", "Value / Range"],
        ["Rated voltage", "120/240 V AC (split-phase, Canadian residential)"],
        ["Rated current", "15 A / 20 A / 30 A (model variants)"],
        ["Breaking capacity", "6 kA or 10 kA @ rated voltage"],
        ["Thermal trip", "Inverse-time, IEC Type B/C curve"],
        ["Magnetic trip", "Instantaneous, 5–10 × In"],
        ["Arc detection response", "&lt; 100 ms (target)"],
        ["Wi-Fi", "2.4 GHz, 802.11 b/g/n (ISED certified module)"],
        ["Bluetooth", "BLE 5.0 for provisioning"],
        ["Operating temperature", "−25 °C to +55 °C"],
        ["Form factor", "2-module DIN rail (36 mm width)"],
        ["Ingress protection", "IP20 (panel interior)"],
    ]
    story.append(professional_table(styles, specs, [5.5 * cm, 10.0 * cm], center_cols={1}))
    story.append(Spacer(1, 0.5 * cm))

    bom = [
        ["Ref", "Component", "Qty"],
        ["U1", "Microcontroller (ARM Cortex-M4, 120 MHz)", "1"],
        ["U2", "Wi-Fi/BLE combo module (ISED-certified)", "1"],
        ["T1", "Current transformer / shunt (0–30 A)", "1"],
        ["R1", "Voltage sensing divider network", "1"],
        ["TH1", "NTC temperature sensor", "1"],
        ["AS1", "Arc sensor (optical / HF current)", "1–2"],
        ["K1", "Magnetic trip solenoid", "1"],
        ["BM1", "Bimetallic thermal element", "1"],
        ["AR1", "Arc runner assembly (copper alloy)", "1"],
        ["PC1", "Pre-chamber plate set (ceramic)", "2–4"],
        ["AC1", "Arc chamber housing (vented)", "1"],
        ["LED1–4", "Status LEDs (fault categories)", "4"],
        ["PS1", "AC-DC power supply IC (3.3 V / 5 V)", "1"],
        ["M1", "Flash memory (4–16 MB)", "1"],
    ]
    story.append(Paragraph("Key Components (BOM)", styles["SubHead"]))
    story.append(professional_table(styles, bom, [1.6 * cm, 10.4 * cm, 1.5 * cm], header_color=BLUE, center_cols={2}))
    story.append(PageBreak())


def add_filing_timeline(story, styles):
    story.append(Paragraph("CIPO Filing Roadmap", styles["SectionHead"]))
    png = svg_to_png(DRAWINGS / "figure-11-filing-timeline.svg", scale=3.5)
    story.append(Image(str(png), width=16 * cm, height=5 * cm))
    story.append(Spacer(1, 0.5 * cm))

    fees = [
        ["Fee item", "Standard entity", "Small entity (if eligible)"],
        ["Application (filing)", "$595.06 CAD", "$241.24 CAD"],
        ["Request for examination", "$1,190.13 CAD", "$482.48 CAD"],
        ["Excess claims (&gt;20)", "$117.94 CAD each", "$58.97 CAD each"],
        ["Final fee (on allowance)", "$446.03 CAD", "$181.20 CAD"],
    ]
    story.append(professional_table(styles, fees, [5.5 * cm, 4.5 * cm, 4.5 * cm], header_color=PURPLE, center_cols={1, 2}))
    story.append(PageBreak())


def add_signature_page(story, styles):
    story.append(Paragraph("Applicant Declaration &amp; Signature", styles["SectionHead"]))
    story.append(Paragraph(
        "I declare that the information in this patent application package is true and complete "
        "to the best of my knowledge. I understand this is a draft document and must be reviewed "
        "by a registered Canadian patent agent before filing with CIPO.",
        styles["Body"],
    ))
    story.append(Spacer(1, 1 * cm))
    sig = [
        ["Inventor / Applicant", "Azfar Mushtaq"],
        ["Signature", "_________________________________"],
        ["Date", "_________________________________"],
        ["Address", "_________________________________"],
        ["City, Province, Postal Code", "_________________________________"],
        ["Patent Agent (if appointed)", "_________________________________"],
        ["Agent registration #", "_________________________________"],
    ]
    story.append(professional_table(styles, sig, [5.5 * cm, 9.5 * cm], has_header=False))
    story.append(Spacer(1, 1 * cm))
    story.append(Paragraph(
        "<b>Filing checklist:</b> □ Prior art search  □ Agent review  □ Petition completed  "
        "□ Drawings finalized  □ Fees prepared  □ CIPO e-filing account  □ Examination request scheduled",
        styles["Body"],
    ))


def main():
    styles = build_styles()
    doc = PatentDocTemplate(
        str(OUTPUT),
        title="ElecSecure Canada Patent Package v2",
        author="Azfar Mushtaq",
    )

    story = []

    # Cover (uses cover template for first page only - we'll switch after)
    add_cover(story, styles)

    # Switch to content template for rest - handled by adding PageBreak and using content template
    # For simplicity, use single template - cover page won't have header which is fine for page 1

    toc = add_toc(story, styles)
    add_executive_summary(story, styles)
    add_competitive_table(story, styles)

    story.extend(section_divider(styles, "I", "FILING GUIDE"))
    add_markdown_full(story, styles, "Filing Guide &amp; Checklist", BASE / "00_CANADA_FILING_GUIDE.md", include_title=False)

    story.extend(section_divider(styles, "II", "PETITION"))
    add_markdown_full(story, styles, "Petition for a Patent", BASE / "01_PETITION.md", include_title=False)

    story.extend(section_divider(styles, "III", "ABSTRACT"))
    add_markdown_full(story, styles, "Abstract", BASE / "02_ABSTRACT.md", include_title=False)

    story.extend(section_divider(styles, "IV", "DESCRIPTION"))
    add_markdown_full(story, styles, "Description of the Invention", BASE / "03_DESCRIPTION.md", include_title=False)

    story.extend(section_divider(styles, "V", "CLAIMS"))
    add_claims(story, styles, include_title=False)

    story.extend(section_divider(styles, "VI", "TECHNICAL DRAWINGS"))
    add_blueprints_summary(story, styles)

    figures = [
        (1, "System Architecture", "End-to-end data flow among protection device (102), local network (104), cloud platform (106), mobile app (108), and smart-home devices (110).", "figure-01-system-architecture.svg"),
        (2, "Device Front Elevation", "Two-module DIN form factor (202) with bidirectional terminals (204, 206), LED fault indicators (208), and test/reset interface (210). Width: 36 mm.", "figure-02-device-front-elevation.svg"),
        (3, "Arc Extinguishing Subsystem", "Sectional view: arc runners (302), pre-chamber plates (304), arc chamber (306), arc sensor (308).", "figure-03-arc-chamber-section.svg"),
        (4, "Internal Electronics Block Diagram", "Microcontroller (402), sensors (408), trip mechanisms (404, 406), connectivity (410), memory (414), arc subsystem (300).", "figure-04-electronics-block-diagram.svg"),
        (5, "Local Fault Detection Flowchart", "Process (500): acquisition, threshold evaluation, tripping, arc analysis, extinguishing, alert transmission.", "figure-05-fault-detection-flowchart.svg"),
        (6, "Cloud Processing Flowchart", "Process (600): ingestion, storage, rule engine, ML module (612), recommendations, feedback loop.", "figure-06-cloud-processing-flowchart.svg"),
        (7, "Dual Tripping Mechanism", "Overload path (702) via bimetallic element (710); short-circuit path (720) via solenoid (726).", "figure-07-dual-tripping-schematic.svg"),
        (8, "Mobile Application Interface", "Dashboard (802), circuits (804), alerts (806), remote control (808), analytics (810), tips (812), smart-home (814).", "figure-08-mobile-app-wireframe.svg"),
        (9, "Invention Overview", "Integrated system (100) showing core inventive features and component relationships.", "figure-09-invention-overview.svg", 14, 9.6),
        (10, "Panel Installation Blueprint", "Typical Canadian residential panel installation with DIN rail mounting and bidirectional feed options.", "figure-10-panel-installation.svg", 15.5, 9.5),
    ]
    for fig in figures:
        if len(fig) == 6:
            add_figure_page(story, styles, fig[0], fig[1], fig[2], fig[3], fig[4], fig[5])
        else:
            add_figure_page(story, styles, *fig)

    add_bom_and_specs(story, styles)
    add_filing_timeline(story, styles)
    add_signature_page(story, styles)

    doc.build(story)

    print(f"Generated: {OUTPUT}")
    print(f"Pages: (see PDF)")
    print(f"Size: {OUTPUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
