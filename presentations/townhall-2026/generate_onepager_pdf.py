#!/usr/bin/env python3
"""Generate printable PDF executive one-pager."""

from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import HRFlowable, Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

BASE = Path(__file__).parent
LOGO = BASE / "assets" / "elecsecure-logo-small.png"
OUTPUT = BASE / "ElecSecure-Executive-OnePager.pdf"

NAVY = colors.HexColor("#0B1F3A")
BLUE = colors.HexColor("#007AE6")
TEAL = colors.HexColor("#00B8A9")


def build_pdf():
    doc = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4,
        leftMargin=1.5 * cm, rightMargin=1.5 * cm,
        topMargin=1.2 * cm, bottomMargin=1.2 * cm,
    )
    styles = getSampleStyleSheet()
    title = ParagraphStyle("T", parent=styles["Heading1"], fontSize=22, textColor=NAVY, spaceAfter=4)
    h2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=13, textColor=BLUE, spaceBefore=10, spaceAfter=4)
    body = ParagraphStyle("B", parent=styles["BodyText"], fontSize=9.5, leading=13)
    small = ParagraphStyle("S", parent=styles["BodyText"], fontSize=8.5, textColor=colors.grey, leading=11)

    story = []
    if LOGO.exists():
        story.append(Image(str(LOGO), width=1.2 * cm, height=1.2 * cm))
    story += [
        Paragraph("ElecSecure — Executive One-Pager", title),
        Paragraph("Annual Town Hall 2026 | Azfar Mushtaq, Managing Director", small),
        Spacer(1, 0.2 * cm),
        HRFlowable(width="100%", thickness=1, color=TEAL),
        Spacer(1, 0.2 * cm),
        Paragraph("What is ElecSecure?", h2),
        Paragraph(
            "A smart electrical safety and energy management platform: hardware device + mobile app + cloud analytics. "
            "It helps homes and businesses detect faults early, reduce energy waste, and control electrical systems remotely.",
            body,
        ),
        Paragraph("The Problem", h2),
        Paragraph(
            "Electrical faults are often detected too late. Energy waste is invisible. Smart homes lack integrated electrical protection. "
            "Businesses face downtime, safety risk, and rising energy costs.",
            body,
        ),
        Paragraph("Our Solution", h2),
        Paragraph("<b>Safety</b> — Real-time fault detection and arc protection<br/>"
                    "<b>Savings</b> — Energy insights that reduce waste and bills<br/>"
                    "<b>Control</b> — Remote monitoring and alerts from anywhere", body),
        Paragraph("Market & Business Model", h2),
    ]

    market_data = [
        ["UK market size", "£2.4B+ (2023)"],
        ["Growth rate", "12.6% annually"],
        ["Device price", "£300 per unit"],
        ["Subscription", "£49/month"],
        ["Support services", "£115 packages"],
    ]
    t1 = Table(market_data, colWidths=[5 * cm, 10 * cm])
    t1.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.lightgrey),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t1)

    story += [Paragraph("3-Year Outlook", h2)]
    fin = [
        ["Year", "Customers", "Revenue", "Status"],
        ["1", "400", "£235K", "Launch & foundation"],
        ["2", "800", "£751K", "Profitable (£154K profit)"],
        ["3", "1,500", "£1.42M", "Market leadership (£448K profit)"],
    ]
    t2 = Table(fin, colWidths=[2 * cm, 3 * cm, 3.5 * cm, 6.5 * cm])
    t2.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BLUE),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.25, colors.lightgrey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.white, colors.whitesmoke]),
    ]))
    story.append(t2)

    story += [
        Paragraph("What We Need", h2),
        Paragraph(
            "1) Leadership endorsement for phased execution<br/>"
            "2) Cross-team collaboration where relevant<br/>"
            "3) Introductions to potential customers and partners",
            body,
        ),
        Spacer(1, 0.3 * cm),
        HRFlowable(width="100%", thickness=1, color=TEAL),
        Paragraph("<i>ElecSecure — Making electricity safer, smarter, and more efficient.</i>", small),
    ]

    doc.build(story)
    print(f"Created: {OUTPUT}")


if __name__ == "__main__":
    build_pdf()
