#!/usr/bin/env python3
"""Generate ElecSecure brand logo assets."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).parent
NAVY = (11, 31, 58)
ELECTRIC_BLUE = (0, 122, 230)
TEAL = (0, 184, 169)
WHITE = (255, 255, 255)


def draw_logo(size=512):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    margin = size * 0.08
    # Shield background
    shield = [
        (size * 0.5, margin),
        (size - margin, size * 0.28),
        (size - margin, size * 0.62),
        (size * 0.5, size - margin),
        (margin, size * 0.62),
        (margin, size * 0.28),
    ]
    d.polygon(shield, fill=NAVY)
    d.polygon(shield, outline=ELECTRIC_BLUE, width=max(2, size // 80))

    # Lightning bolt
    bolt = [
        (size * 0.56, size * 0.22),
        (size * 0.38, size * 0.52),
        (size * 0.5, size * 0.52),
        (size * 0.42, size * 0.78),
        (size * 0.64, size * 0.44),
        (size * 0.52, size * 0.44),
    ]
    d.polygon(bolt, fill=TEAL)

    # Inner ring accent
    cx, cy, r = size * 0.5, size * 0.5, size * 0.34
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=ELECTRIC_BLUE, width=max(2, size // 100))

    return img


def draw_wordmark(width=1200, height=300):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    icon = draw_logo(220)
    img.paste(icon, (10, 40), icon)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 96)
        subfont = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 34)
    except OSError:
        font = ImageFont.load_default()
        subfont = ImageFont.load_default()
    d.text((250, 70), "ElecSecure", fill=WHITE, font=font)
    d.text((255, 175), "Smart Electrical Safety", fill=TEAL, font=subfont)
    return img


if __name__ == "__main__":
    draw_logo(512).save(OUT / "elecsecure-logo.png")
    draw_logo(128).save(OUT / "elecsecure-logo-small.png")
    draw_wordmark().save(OUT / "elecsecure-wordmark.png")
    print("Logo assets created in", OUT)
