#!/usr/bin/env python3
"""Generate ElecSecure Canadian patent package PDF with embedded visuals."""

from __future__ import annotations

import re
from io import BytesIO
from pathlib import Path

import cairosvg
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
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
OUTPUT = BASE / "ElecSecure_Canada_Patent_Package.pdf"
TMP = BASE / ".pdf_assets"
TMP.mkdir(exist_ok=True)


def svg_to_png(svg_path: Path, scale: float = 2.0) -> Path:
    png_path = TMP / f"{svg_path.stem}.png"
    cairosvg.svg2png(
        url=str(svg_path),
        write_to=str(png_path),
        scale=scale,
    )
    return png_path


def clean_md(text: str) -> str:
    text = re.sub(r"^#+\s*", "", text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`(.+?)`", r"<font face='Courier'>\1</font>", text)
    text = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", text)
    text = text.replace("&", "&amp;")
    # Escape stray angle brackets not part of allowed tags
    allowed = ("b", "/b", "i", "/i", "font", "/font", "br", "/br")
    parts = re.split(r"(<[^>]+>)", text)
    out = []
    for part in parts:
        if part.startswith("<") and part.endswith(">"):
            tag = re.sub(r"[</>]", "", part).split()[0]
            if tag in allowed or part in ("<br/>", "<br />"):
                out.append(part)
            else:
                out.append(part.replace("<", "&lt;").replace(">", "&gt;"))
        else:
            out.append(part.replace("<", "&lt;").replace(">", "&gt;"))
    return "".join(out)


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            parent=styles["Title"],
            fontSize=22,
            leading=28,
            alignment=TA_CENTER,
            spaceAfter=20,
            textColor=colors.HexColor("#1a365d"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverSub",
            parent=styles["Normal"],
            fontSize=13,
            leading=18,
            alignment=TA_CENTER,
            spaceAfter=8,
            textColor=colors.HexColor("#2d3748"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHead",
            parent=styles["Heading1"],
            fontSize=16,
            leading=20,
            spaceBefore=16,
            spaceAfter=10,
            textColor=colors.HexColor("#1a365d"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubHead",
            parent=styles["Heading2"],
            fontSize=13,
            leading=16,
            spaceBefore=10,
            spaceAfter=6,
            textColor=colors.HexColor("#2c5282"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["Normal"],
            fontSize=10,
            leading=14,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyBullet",
            parent=styles["Normal"],
            fontSize=10,
            leading=13,
            leftIndent=14,
            bulletIndent=6,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Caption",
            parent=styles["Normal"],
            fontSize=9,
            leading=12,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#4a5568"),
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Disclaimer",
            parent=styles["Normal"],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#c53030"),
            spaceAfter=6,
        )
    )
    return styles


def add_cover(story, styles):
    story.append(Spacer(1, 3 * cm))
    story.append(Paragraph("ELECSECURE", styles["CoverTitle"]))
    story.append(Paragraph(
        "Canadian Patent Application Package<br/>(CIPO Draft)",
        styles["CoverSub"],
    ))
    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph(
        "<b>SMART ELECTRICAL SAFETY AND ENERGY EFFICIENCY<br/>"
        "MANAGEMENT SYSTEM WITH IoT-ENABLED ARC FAULT<br/>"
        "PROTECTION AND INTEGRATED CLOUD ANALYTICS</b>",
        styles["CoverSub"],
    ))
    story.append(Spacer(1, 1.2 * cm))

    meta = [
        ["Applicant / Inventor", "Azfar Mushtaq"],
        ["Jurisdiction", "Canada — CIPO"],
        ["Document version", "Draft 1.0 — September 2026"],
        ["Total claims", "20"],
        ["Technical figures", "8"],
    ]
    t = Table(meta, colWidths=[5.5 * cm, 9 * cm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#edf2f7")),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e0")),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 1 * cm))
    story.append(Paragraph(
        "<b>Important:</b> This document is a technical draft for review by a registered "
        "Canadian patent agent. It is not legal advice and is not filed with CIPO.",
        styles["Disclaimer"],
    ))
    story.append(PageBreak())


def add_toc(story, styles):
    story.append(Paragraph("Table of Contents", styles["SectionHead"]))
    story.append(Spacer(1, 0.3 * cm))
    items = [
        "1. Filing Guide &amp; Checklist",
        "2. Petition for a Patent",
        "3. Abstract",
        "4. Description of the Invention",
        "5. Claims (1–20)",
        "6. Technical Blueprints &amp; Reference Numerals",
        "7. Figure 1 — System Architecture",
        "8. Figure 2 — Device Front Elevation",
        "9. Figure 3 — Arc Extinguishing Subsystem",
        "10. Figure 4 — Internal Electronics Block Diagram",
        "11. Figure 5 — Local Fault Detection Flowchart",
        "12. Figure 6 — Cloud Processing Flowchart",
        "13. Figure 7 — Dual Tripping Mechanism",
        "14. Figure 8 — Mobile Application Interface",
        "15. Bill of Materials &amp; Electrical Specifications",
    ]
    for item in items:
        story.append(Paragraph(item, styles["Body"]))
    story.append(PageBreak())


def add_markdown_section(story, styles, title: str, md_path: Path, max_paras: int | None = None):
    story.append(Paragraph(title, styles["SectionHead"]))
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    count = 0
    for line in lines:
        line = line.strip()
        if not line or line.startswith("---") or line.startswith("|") or line.startswith("# "):
            continue
        if line.startswith("## "):
            story.append(Paragraph(clean_md(line[3:]), styles["SubHead"]))
            continue
        if line.startswith("### "):
            story.append(Paragraph(clean_md(line[4:]), styles["SubHead"]))
            continue
        if line.startswith("- ") or line.startswith("* "):
            story.append(Paragraph("• " + clean_md(line[2:]), styles["BodyBullet"]))
            count += 1
        elif line.startswith("➢ "):
            story.append(Paragraph("• " + clean_md(line[2:]), styles["BodyBullet"]))
            count += 1
        elif re.match(r"^\d+\.", line):
            story.append(Paragraph(clean_md(line), styles["BodyBullet"]))
            count += 1
        else:
            story.append(Paragraph(clean_md(line), styles["Body"]))
            count += 1
        if max_paras and count >= max_paras:
            story.append(Paragraph("<i>(Continued in source documents…)</i>", styles["Body"]))
            break
    story.append(PageBreak())


def add_figure(story, styles, fig_num: int, title: str, caption: str, svg_name: str):
    story.append(Paragraph(f"FIGURE {fig_num}", styles["SubHead"]))
    story.append(Paragraph(title, styles["Body"]))
    story.append(Spacer(1, 0.2 * cm))
    png = svg_to_png(DRAWINGS / svg_name)
    img = Image(str(png))
    max_w = 16 * cm
    max_h = 20 * cm
    ratio = min(max_w / img.drawWidth, max_h / img.drawHeight)
    img.drawWidth *= ratio
    img.drawHeight *= ratio
    story.append(img)
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph(f"<b>FIG. {fig_num}</b> — {caption}", styles["Caption"]))
    story.append(PageBreak())


def add_blueprints_summary(story, styles):
    story.append(Paragraph("Technical Blueprints &amp; Reference Numerals", styles["SectionHead"]))
    story.append(Paragraph(
        "The following reference numerals are used consistently across all figures and the "
        "patent description.",
        styles["Body"],
    ))
    refs = [
        ("100", "Smart electrical safety and energy efficiency management system"),
        ("102", "ElecSecure IoT-enabled protection device"),
        ("104", "Local network (Wi-Fi / LAN)"),
        ("106", "Cloud-based data platform"),
        ("108", "Mobile application"),
        ("300", "Arc extinguishing subsystem"),
        ("302", "Arc runners"),
        ("304", "Pre-chamber plates"),
        ("306", "Arc chamber"),
        ("402", "Microcontroller"),
        ("404", "Delayed thermal tripping mechanism"),
        ("406", "Magnetic tripping mechanism"),
        ("408", "Sensor array"),
        ("410", "Connectivity module (Wi-Fi / BLE)"),
        ("612", "Machine-learning module"),
    ]
    data = [["Numeral", "Element"]] + refs
    t = Table(data, colWidths=[2.2 * cm, 13 * cm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2c5282")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7fafc")]),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e0")),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t)
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
        ["Arc detection response", "< 100 ms (target)"],
        ["Wi-Fi", "2.4 GHz, 802.11 b/g/n"],
        ["BLE", "5.0, provisioning service"],
        ["Operating temperature", "−25 °C to +55 °C"],
        ["Form factor", "2-module DIN rail (36 mm width)"],
    ]
    t = Table(specs, colWidths=[5.5 * cm, 10 * cm])
    t.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a365d")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7fafc")]),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e0")),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Key Components (BOM)", styles["SubHead"]))
    bom = [
        ["Ref", "Component", "Qty"],
        ["U1", "Microcontroller (ARM Cortex-M4)", "1"],
        ["U2", "Wi-Fi/BLE combo module (ISED-certified)", "1"],
        ["T1", "Current transformer / shunt (0–30 A)", "1"],
        ["AS1", "Arc sensor (optical / HF current)", "1–2"],
        ["K1", "Magnetic trip solenoid", "1"],
        ["BM1", "Bimetallic thermal element", "1"],
        ["AR1", "Arc runner assembly", "1"],
        ["AC1", "Arc chamber housing", "1"],
        ["LED1–4", "Status LEDs (fault categories)", "4"],
    ]
    t2 = Table(bom, colWidths=[1.8 * cm, 10.5 * cm, 1.5 * cm])
    t2.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2c5282")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7fafc")]),
        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e0")),
        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(t2)
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Canadian Regulatory References", styles["SubHead"]))
    regs = [
        "• Canadian Electrical Code (CEC), Part I — CSA C22.1",
        "• CSA C22.2 No. 5 — Molded-case circuit breakers",
        "• CEC Rule 26-720 et seq. — AFCI requirements for dwelling units",
        "• ISED radio certification for Wi-Fi/BLE modules",
    ]
    for r in regs:
        story.append(Paragraph(r, styles["BodyBullet"]))


def main():
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title="ElecSecure Canada Patent Package",
        author="Azfar Mushtaq",
    )

    story = []
    add_cover(story, styles)
    add_toc(story, styles)

    add_markdown_section(story, styles, "1. Filing Guide &amp; Checklist", BASE / "00_CANADA_FILING_GUIDE.md", max_paras=35)
    add_markdown_section(story, styles, "2. Petition for a Patent", BASE / "01_PETITION.md", max_paras=40)
    add_markdown_section(story, styles, "3. Abstract", BASE / "02_ABSTRACT.md", max_paras=10)
    add_markdown_section(story, styles, "4. Description of the Invention", BASE / "03_DESCRIPTION.md", max_paras=55)
    add_markdown_section(story, styles, "5. Claims", BASE / "04_CLAIMS.md", max_paras=60)

    add_blueprints_summary(story, styles)

    figures = [
        (1, "System Architecture", "End-to-end data flow among protection device (102), local network (104), cloud platform (106), mobile app (108), and smart-home devices (110).", "figure-01-system-architecture.svg"),
        (2, "Device Front Elevation", "Two-module DIN form factor (202) with bidirectional terminals (204, 206), LED fault indicators (208), and test/reset interface (210). Width: 36 mm.", "figure-02-device-front-elevation.svg"),
        (3, "Arc Extinguishing Subsystem (Section)", "Arc runners (302) guide fault arcs through pre-chamber plates (304) into arc chamber (306) for subdivision and extinguishing. Arc sensor (308) shown.", "figure-03-arc-chamber-section.svg"),
        (4, "Internal Electronics Block Diagram", "Microcontroller (402) interfaces with power supply (412), sensor array (408), trip mechanisms (404, 406), connectivity module (410), memory (414), and arc subsystem (300).", "figure-04-electronics-block-diagram.svg"),
        (5, "Local Fault Detection Flowchart", "Process (500) for sensor acquisition, threshold evaluation, magnetic/thermal tripping, arc analysis, extinguishing, and cloud alert transmission.", "figure-05-fault-detection-flowchart.svg"),
        (6, "Cloud Processing Flowchart", "Server-side process (600) for telemetry ingestion, storage, rule-based alerts, machine-learning analysis (612), and recommendation delivery.", "figure-06-cloud-processing-flowchart.svg"),
        (7, "Dual Tripping Mechanism Schematic", "Independent overload path (702) via bimetallic element (710) and short-circuit path (720) via solenoid (726) actuating contacts (716).", "figure-07-dual-tripping-schematic.svg"),
        (8, "Mobile Application Interface", "User interface (108) with dashboard (802), circuit panel (804), alerts (806), remote control (808), analytics (810), recommendations (812), and smart-home integration (814).", "figure-08-mobile-app-wireframe.svg"),
    ]
    for num, title, caption, svg in figures:
        add_figure(story, styles, num, title, caption, svg)

    add_bom_and_specs(story, styles)

    doc.build(story)
    print(f"Generated: {OUTPUT}")
    print(f"Size: {OUTPUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
