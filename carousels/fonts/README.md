# Vithu Law — Brand Fonts

Fonts used in the C1 and C2 carousels. All are free under the [SIL Open Font License](https://scripts.sil.org/OFL).

## Type roles

| Role | Font | Carousel use |
|------|------|----------------|
| Display serif | **Cormorant Garamond** | Headlines (roman + italic) |
| Mono | **IBM Plex Mono** | Labels, numerals, source lines, CTA, signature |
| Sans | **Source Sans 3** | Body copy |

## Folder structure

```
fonts/
├── Cormorant-Garamond/
│   ├── ttf/          ← Install these in Figma, Canva, Word, etc.
│   └── *.woff2       ← Web use
├── IBM-Plex-Mono/
│   ├── ttf/
│   └── *.woff2
└── Source-Sans-3/
    ├── ttf/
    └── *.woff2
```

## Weights used in carousels

| Font | Weight | File |
|------|--------|------|
| Cormorant Garamond | Medium (500) | Variable font or `*-500-normal.woff2` |
| Cormorant Garamond | SemiBold (600) | Variable font or `*-600-normal.woff2` |
| Cormorant Garamond | Medium Italic (500) | Variable italic or `*-500-italic.woff2` |
| IBM Plex Mono | Regular (400) | `IBMPlexMono-Regular.ttf` |
| IBM Plex Mono | Medium (500) | `IBMPlexMono-Medium.ttf` |
| Source Sans 3 | Regular (400) | Variable font or `*-400-normal.woff2` |
| Source Sans 3 | Medium (500) | Variable font or `*-500-normal.woff2` |

Variable `.ttf` files include the full weight range — use Medium (~500) and SemiBold (~600) in your design tool.

## Install (desktop)

1. Download `vithu-law-brand-fonts.zip`
2. Unzip
3. Open each `ttf/` folder and double-click fonts to install (Mac/Windows), or add to your font manager

## Web use

```css
@font-face {
  font-family: "Cormorant Garamond";
  src: url("./Cormorant-Garamond/cormorant-garamond-latin-500-normal.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
}
```

Or use Google Fonts CDN (same families):

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=IBM+Plex+Mono:wght@400;500&family=Source+Sans+3:wght@400;500&display=swap" rel="stylesheet" />
```
