# Dr. Ice — Shopify theme assets and build prompts

Source design: [Figma file `dr`](https://www.figma.com/design/tmuEhjmptaA06R4H7TDnz4/dr).

Brand: **Dr. Ice** (Doctor Ice / Dr Ice Jewelry), custom fine jewellery, Vaughan, Ontario. Studio WhatsApp: `6479232533`.

This folder is the handoff for a custom Shopify Online Store 2.0 theme built with Shopify CLI. It is not a finished theme. Copy `assets/` into the theme `assets/` directory, use `references/` as the visual spec, and paste the prompts in `prompts/` into the AI that will generate the theme.

## Folders

| Folder | Use |
| --- | --- |
| `assets/heroes/` | Named homepage, story, founder, rings, and fabric photos. Prefer the `*-a` or `*-render` file when a pair exists. |
| `assets/homepage/` `assets/about/` `assets/shop/` `assets/product/` | Extra photos pulled from those screens. |
| `assets/quotes/` | Option photos for the pendant, chain, and ring quote steps. |
| `assets/icons/` | Cart, diamond, and small UI marks exported as SVG. |
| `references/` | Full-screen renders. Match layout to these, not to a guessed theme. |
| `prompts/` | Paste-ready prompts for an AI using Shopify CLI. |

`ASSET-INDEX.csv` lists every file, byte size, and a short hash.

## How to drop these into a theme

```bash
shopify theme init dr-ice
cp -R dr-ice-shopify/assets/. dr-ice/assets/
shopify theme dev --store your-store.myshopify.com
```

In Liquid, reference a file as `{{ 'homepage-hero-render.png' | asset_url }}`.

## What the screens are

- Home, Shop, About Us, Faqs, Book Appointment
- Instant Pendant Quote, Instant Chain Quote, Instant Ring Quote (multi-step wizards, not normal product pages)
- Collection grid and product page

Header (every page): black bar, diamond + **DR. ICE** wordmark, links Home / Shop / About Us / Instant Pendant Quote / Instant Chain Quote / Instant Ring Quote / Faqs, blue **Book Appointment** button, cart with a count badge.

Footer: black field with a rough brush edge, diamond + DR. ICE, columns Our Company / Collection / Quote, `©2026 Dr Ice Jewelry. All rights reserved`, Facebook, LinkedIn, YouTube, Instagram, TikTok.

Page background is a cool off-white. Headlines are a high-contrast serif. Buttons, prices, and card arrows are blue. Cards sit on a pale blue panel with a blue stroke.

## Limit of this export

Figma’s asset API returns at most 20 source images per frame, and the Starter plan rate limit stopped further calls. Shared header and footer images are therefore mixed into some quote folders, and a few option thumbnails from later steps were not exported as separate files. The PNGs in `references/` are the layout source of truth. Open those before inventing a step.
