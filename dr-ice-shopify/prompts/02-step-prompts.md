# Step prompts

Use these one at a time after `01-master-prompt.md`. Each prompt assumes the previous step is already in the theme.

## 1. Scaffold

```text
Create a Shopify Online Store 2.0 theme with Shopify CLI named dr-ice, starting from Horizon if `shopify theme init` offers it, otherwise Dawn. Copy dr-ice-shopify/assets into the theme assets folder. Add assets/dr-ice.css with CSS variables for black #0a0a0a, canvas #f4f7fb, blue #3d5a9a, card #eef3fb, and card-border #7f9cc4. Load a serif heading font and a sans body font. Add layout/theme.liquid hooks only where needed so the stylesheet loads. Run shopify theme check.
```

## 2. Header and footer

```text
Replace the header and footer so they match references/shop.png and references/about-hero.png. Black header, diamond + “DR. ICE”, links Home, Shop, About Us, Instant Pendant Quote, Instant Chain Quote, Instant Ring Quote, Faqs, a blue Book Appointment button, and a cart with count. Footer is black with a torn top edge, three columns (Our Company, Collection, Quote) using the links in prompts/01-master-prompt.md, copyright “©2026 Dr Ice Jewelry. All rights reserved”, and social icons. Mobile nav is a dialog. Do not change cart behaviour.
```

## 3. Homepage

```text
Rebuild templates/index.json with the ten homepage sections listed in prompts/01-master-prompt.md. Use homepage-hero-render.png, story-portrait-render.png, custom-jewelry-banner-render.png, rings-feature-render.png, and black-fabric-render.png. Copy must match the prompt word for word. No Dawn slideshow, no newsletter popup.
```

## 4. About, FAQ, appointment

```text
Add page.about.json, page.faq.json, and page.appointment.json. Follow the About, FAQ, and Book appointment sections in prompts/01-master-prompt.md. Use founder-portrait-render.png. FAQ is a details/summary accordion. Appointment posts with Shopify’s contact form and also offers the WhatsApp link https://wa.me/16479232533.
```

## 5. Collection and product

```text
Restyle collection.json to match references/shop.png: ring banner, left-hand category/material/price/sale filters bound to real Shopify filters, sort and pagination, 3-column cards with from-price and arrow. Restyle product.json to match references/product-view.png using the current product’s media, options, and recommendations. Keep Buy it now and the CAD-approval notice. Do not hardcode “Pavé bridal set” as the only product.
```

## 6. Quote wizard

```text
Add sections/quote-wizard.liquid with a flow setting of pendant, chain, or ring. Implement every step in prompts/01-master-prompt.md. One step on screen, Back/Next, selection state, sessionStorage, summary, contact form, and a wa.me/16479232533 link that includes the answers. Use images from assets/quotes. Where a photo is missing, show the reference PNG for that step and a TODO comment. Do not invent a 3D spinner. Wire page.quote-pendant.json, page.quote-chain.json, and page.quote-ring.json to this section.
```

## 7. Check

```text
Run shopify theme check. Fix every error. Click through home, about, a collection, a product, each quote flow to the WhatsApp handoff, appointment, and FAQ at 1440px and 375px. List any mismatch against references/*.png and fix it before you stop.
```
