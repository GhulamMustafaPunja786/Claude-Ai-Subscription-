# Master prompt — build the Dr. Ice theme with Shopify CLI

Paste everything below the line into the AI that has this `dr-ice-shopify` folder and a Shopify store.

---

You are building a custom Shopify Online Store 2.0 theme for **Dr. Ice** (legal-style name on the site: Dr Ice Jewelry). Use Shopify CLI only. Do not use a page builder, Hydrogen, or a third-party theme app.

## Start

```bash
shopify theme init dr-ice
```

If the CLI offers Horizon, start from Horizon. Otherwise start from Dawn. Then copy every file from `dr-ice-shopify/assets/` into `dr-ice/assets/` and keep `dr-ice-shopify/references/` open beside the code. Run `shopify theme dev` against the store and check each template in the browser before moving on.

Keep Dawn/Horizon’s accessibility, cart, and predictive search. Replace the visual design. Do not leave default Dawn marketing sections on the homepage.

## Visual system

Match `references/*.png`.

- Header: full-width black bar. Left: diamond icon plus “DR. ICE”. Center/right nav: Home, Shop, About Us, Instant Pendant Quote, Instant Chain Quote, Instant Ring Quote, Faqs. Far right: blue pill button “Book Appointment”, then a cart icon with a numeric badge.
- Page canvas: cool off-white (`#f4f7fb` range). Body text near-black. Headlines: a sharp serif (use `Cormorant Garamond` or `Playfair Display` from Shopify’s font library). UI text: a clean sans (use `Inter` or the theme default sans).
- Primary action: solid blue button, white label. Secondary action: white or transparent button with a dark or blue stroke.
- Cards: pale blue fill, 1px blue border, generous radius, blue circular arrow on collection cards.
- Footer: black, with a torn white-to-black brush edge along the top. Logo left. Three link columns. Copyright and social icons on the right of the bottom row.
- Do not invent a dark luxury homepage. The homepage hero is a light marble photo. Dark areas are the header, footer, and some quote-step backgrounds.

## Assets

Use local theme assets. Do not hotlink Figma. Prefer these files:

- Homepage hero photo: `homepage-hero-render.png` (iced “DR ICE” pendant on a Cuban chain, white marble, subject on the right, empty marble on the left for the headline).
- Custom-jewelry banner: `custom-jewelry-banner-render.png`.
- Rings feature: `rings-feature-render.png` and `rings-feature-a.png`.
- Story portrait: `story-portrait-render.png`.
- Founder: `founder-portrait-render.png` (man in sunglasses and a cream shirt, arched “DR. ICE” sign behind him, pieces on the table).
- Fabric band: `black-fabric-render.png`.
- Quote option photos: folders `quotes/pendant-type`, `quotes/pendant-ice`, `quotes/pendant-stones`, `quotes/chain-style`, `quotes/ring-setting`, `quotes/ring-head`, `quotes/ring-band`.
- Icons: `icons/icon-cart.svg`, `icons/icon-diamond.svg`.

If a step’s option image is missing, use the matching file in `references/` as the picture and a neutral placeholder, and leave a `TODO` comment. Do not generate new jewellery photography.

## Information architecture

Create these templates and pages:

| URL | Template | Job |
| --- | --- | --- |
| `/` | `index.json` | Homepage |
| `/pages/about` | `page.about.json` | Founder story |
| `/collections` and `/collections/rings` | `collection.json` | Shop grid |
| `/products/...` | `product.json` | Product detail |
| `/pages/instant-pendant-quote` | `page.quote-pendant.json` | Pendant wizard |
| `/pages/instant-chain-quote` | `page.quote-chain.json` | Chain wizard |
| `/pages/instant-ring-quote` | `page.quote-ring.json` | Ring wizard |
| `/pages/book-appointment` | `page.appointment.json` | Booking form |
| `/pages/faq` | `page.faq.json` | FAQ |

Navigation menu `main-menu` uses the header links above. Footer menus:

- Our Company: Home, About Us, Shop, Book Appointment
- Collection: Pendants, Wedding rings, Cuban chains, Grillz, Bracelets, Ear rings, Mens rings, Merch
- Quote: Instant Pendant Quote, Instant Chain Quote, Instant Ring Quote

Create those collections in comments or in a `shopify` setup note if the CLI cannot create them. Assign products later. Seed the Rings collection with the “from $900” card pattern.

## Homepage sections, top to bottom

1. Hero. Background is the marble pendant photo. Left-aligned copy over the empty marble:
   - Eyebrow: `PREMIUM CUSTOM JEWELLERY`
   - Headline: `Cut to your idea.`
   - Body: `Send a reference or just describe what you want. You get a price back the same day and a CAD render to approve — before you pay for anything.`
   - Buttons: `Book Appointment` (primary) and a secondary quote button.
2. Story split. Photo left. Right copy: `No two pieces leave here the same` and `Every piece starts as a conversation, not a catalogue. You describe it, approve the render, and it gets built for you alone — sized, set and finished to your hand.` Trust line: `IGI & GIA certified stones · 8 years at the bench · Lifetime warranty & free resizing`.
3. Full-bleed banner. `DESIGN YOUR OWN JEWELRY`. Subcopy: `A fully custom made Jewelry made specifically for you in 4 - 6 weeks.` and `Design and revisions cost nothing.`
4. Rings feature. Giant word `RINGS`. Headline `Explore Our Custom Engagement Rings`. Short paragraph about handcrafted engagement rings. Buttons `Explore Rings` and `Create Your Own`.
5. Cuban chain feature. Title `Elegance Unbound`. Body about a Cuban link set: polished links, surgical precision, modern durability. Button `Explore Cuban Chain`.
6. Category intro. `Four things we build more than anything else.` and `Everything is made to order. Nothing on this page is a stock piece — these are starting points for yours.` Button `Get an instant quote`.
7. Worn-by row. Label `PIECES WORN BY`. Names: NDO Champ, AR Paisley, Kyle Landi, Singhinks.
8. Stats: `Worldwide` / Insured, shipping covered. `Unlimited` / Design revisions, free. `48 hours` / Rush wedding bands. `Same day` / Quote and CAD render.
9. Process. `Five steps. You approve before you commit.` Supporting line: `Most jewellers quote in days and charge for the design. Here the quote is same-day and the render is free.`
   - 01 Message me — WhatsApp a reference photo or describe the idea.
   - 02 Price, same day — itemised quote: metal, stones, labour. No deposit.
   - 03 See the Render — 3D render, unlimited free revisions.
   - 04 Built at the bench — five to thirty days, or 48 hours on wedding bands for a rush fee.
   - 05 Collect or ship — Vaughan studio, or insured shipping anywhere.
10. Pendants closer. `BESPOKE BRILLIANCE` / customer-review treatment and `Explore Pendants`. Copy mentions custom pendants, including a Jesus piece and personal initials.

## About

Headline: `THERE'S A FACE BEHIND THIS ONE`.

Body, first person from the founder:

`Most jewellers hide. You get a quote from an inbox, a piece from a workshop you'll never see, and no idea who actually made it. I started Doctor Ice because I got tired of that — and because I got burned by it myself when I was younger.`

`Now every quote, every render and every piece comes from me directly. You'll know exactly who made what you're wearing.`

Portrait in an arched crop using `founder-portrait-render.png`. Credit: `DR ICE`, `Owner & Founder`. Script signature “DR ICE”.

Also include: `Eight years shaping metal and setting stones before this business existed.` The same four stats as the homepage. Four principles:

- Design before deposit — CAD renders and unlimited revisions, free. You approve the piece before you pay for it.
- Say the price out loud — itemised quotes: metal, stones, labour.
- No shortcuts in the metal — solid gold and platinum, certified stones.
- Yours the way mine would be — engagements, milestones, first big purchases.

End with `Shop Our Collections`.

## Shop (collection)

Match `references/shop.png`.

- Banner photo of a row of coloured-stone and diamond rings on grey. Centered serif `RINGS` and breadcrumb `Home / Rings`.
- Left filters: Categories (Pendants, Wedding rings, Cuban chains, Grillz), Material (Diamond, Gold, Silver), Price Range `$0`–`$10,000`, Sale. Sale card reads `THE BIG DIAMOND SALE` / `UP TO 20% OFF` / `ON DIAMOND JEWELLERY`.
- Toolbar: `Sort By: Best Selling`, `Showing 1–9 of 9 result`, `Show: 9`.
- 3-column cards. Each card: product image, quick-view and cart icons, title, `FROM $900` in blue, blue arrow button. Empty state and real pagination must still work when the collection is not exactly 9 products.
- Wire filters to Shopify tag or Storefront filtering (`filter.p.m` / `filter.v.option` / `filter.v.price`). Do not fake a second product grid in JavaScript.

## Product

Match `references/product-view.png` for structure, with real product data:

- Breadcrumb, title (example in the design: Pavé bridal set), vendor, availability.
- Gallery plus the vertical clip `assets/product/image-04.gif` only as a sample media item, not hardcoded on every product.
- Price, variant selectors for SIZE (3.5 through 11, including half sizes shown in the design) and MATERIAL (Gold, White Gold).
- Notice: `No deposit. You approve CAD render before anything is made`.
- `Buy it now`. Trust rows: free shipping over $99, free returns.
- Tabs: Description, Sizechart, Reviews, Shipping Policy.
- `You may also like` using Shopify recommendations.

## Quote wizards

Build one section, `quote-wizard`, with a `flow` setting: `pendant`, `chain`, or `ring`. One step visible at a time. State in `sessionStorage`. Back and Next. Selected card gets a blue border. Last step is a summary plus a lead form. No account required. No deposit.

On submit:

- Build a `https://wa.me/16479232533` link whose text is the full configuration.
- Also post the same payload through Shopify’s `{% form 'contact' %}` with a subject like `Pendant quote`, so the merchant has an email record.
- Show a confirmation state. Pendant/chain confirmation headline: `That's with me.` Ring: `Thank you.`

Pendant steps:

1. Intro over the hero: `Let's build your PENDANT.` / `Answer a few questions and you'll have a number before you leave the page. No deposit, no email wall, no pressure.` Stats: Same day quote, Free CAD & revisions, IGI & GIA certified stones, 8 years at the bench.
2. `Natural or lab diamonds?` Options: Lab Diamonds (More stone per dollar), Natural Diamonds (Traditional), Moissanite (Silicon carbide).
3. `Which metal?` Copy: `Solid throughout. Nothing here is plated unless you ask for it.` Use only metals visible in the references and the summary example (Silver is confirmed on the sample summary). If a metal is not in the design, do not add it.
4. `What are we making?` Options, with photos: Business logo, Name or Initial, Portrait or face, Religious piece, Character, Something else. Helper: `Pick the closest thing. You can send a reference later.`
5. `How big should it sit?` `Measured top to bottom, not including the bail.` Options: 1 inch, 1.5, 2, 2.5+, 3, 3.5, 4, 4.5+ inch.
6. `How iced do you want it?` No stones, Outlined edge, Half flooded, Fully flooded, plus an optional free-text field.
7. `Anything else on it?` Multi-select: Engraved back, Iced bail, Custom box.
8. `Send me what you have.` File upload (PNG, JPG, WebP) and optional notes.
9. Summary `Here's your PENDANT.` Show Stones, Metal, Type, Size, Ice, extras. `Save Render` and `Drag to rotate` are labels only unless a real 3D model exists — do not fake a 3D viewer. Form: Name, Email, WhatsApp number. Choices: Book a studio visit, Quote on WhatsApp — same day, Book a call.

Chain steps:

1. `Let's build your Chain.` `Pick the link, the width and how much ice.` Stats include `Solid gold / Never plated`.
2. `Which chain are we making?` Cuban link, Tennis chain, Infinity link chain. Helper: `If you're not sure, Cuban is what most people mean when they say chain.`
3. `do you want it iced out`
4. `Which metal?` Same solid-metal rule.
5. `Natural or lab diamonds?` Same three options as pendant.
6. `How thick?` `Width is the single biggest driver of gold weight — and of price.`
7. `How long?` 18 inch Choker, 20 inch Collarbone, 22 inch Chest, 24 inch Below chest, 26 inch Sternum, 30 inch Waist. `Measured end to end with the clasp closed.`
8. `Which clasp?` Lobster clasp, Box lock, Double box lock. `The part that fails first on a cheap chain.`
9. Optional extras, then reference upload.
10. Summary example from the design: Tennis chain, Platinum, Half flooded, VS clarity F colour, Iced box lock, extras, `Two weeks`.

Ring steps:

1. `Begin with the RING.` `A few questions about the stone, the setting, and the hand it's made for.`
2. `Natural or laboratory-grown?` Natural (Certified by GIA), Lab grown (Certified by IGI), Moissanite (Silicon carbide), Gemstones. Body: `Identical in composition, hardness and certification. Laboratory stones allow a larger stone within the same budget.`
3. `Which shape?` Round brilliant, Princess, Dutch marquise, Old Mine, Portuguese cut, Criss Cut, Bowtie Free, Step cut, Coloured Diamond, Gemstone. `Round holds the most brilliance. Elongated shapes appear larger for the same weight.`
4. `What weight?` 0.5, 1.5, 2.5, 3.5, 4.5, 5+ carat.
5. `Which grade?` SI1 · G, VS1 · F, VVS2 · E, VVS1 · D. Note: `Above VS1 the difference is invisible without magnification.` Also include the separate clarity list and colour list from the design (D through J, colourless to near colorless).
6. `How should it be set?` Solitaire, Cathedral, Three stone, Vintage · Art Deco, Toi et Moi.
7. `How will your diamond be held` Hidden halo, Curved hidden halo, Outer halo, Gallery rail, Tulip basket, Diamond basket, Half bezel, Full bezel.
8. `And the band?` Three-sided pavé, Hidden pavé, Channel set, Band engraving, Split shank, Full eternity, Bubble bands.
9. `Which width?` 1.8mm fine, 2mm classic, 2.5mm medium, 3mm medium, 4mm broad.
10. `Which metal?` `Platinum wears whitest and holds a stone most securely. Gold is warmer and lighter on the hand.`
11. `Anything to make it yours?` Multi-select: Initials engraved inside, Double prong, Euro shank base, Hidden gemstone, Shaped to sit flush with a wedding band, Bridge diamonds, Low profile.
12. Reference upload, optional notes, optional ring size.
13. `When do you need it?` 48–72 hours ($500 rush), One to two weeks, Three to four weeks, Not in a rush.
14. Summary `Here's your Ring.` Example configuration in the design: Laboratory-grown, Cushion, 1.5 carat, VVS2 · E colour, Three stone, Three-sided pavé, 3mm medium, Two tone. Then the same contact form. Studio line: Vaughan.

## Book appointment

Headline: `TELL ME WHEN SUITS YOU.`

Fields: Name, WhatsApp number, Email (optional), What are you looking for? (Engagement or wedding ring, Pendant, Chain, Grillz, Something else), Is this for a date? (Proposal, Wedding, Birthday) plus `Tell me if there's a deadline and I'll work back from it.`, Preferred date, Time of day (Morning), Roughly what's your budget? (optional, include Not sure yet), Anything else (optional). Submit: `Request this time`.

Aside titled `What to Bring`: a reference photo, ring size or a ring they already wear, any piece to match. Details: Where — Vaughan, Ontario, full address sent on confirmation. How long — about 45 minutes. Parking — on site. Cost — free, no deposit. Can’t make it — message on WhatsApp. Note: `No deposit, no obligation. I'll confirm on WhatsApp within the hour.`

## FAQ

Title: `Custom Jewelry FAQ Guide`. Intro welcomes them to Dr. Ice Fine Jewelry.

- How long does custom jewelry take? Wedding rings: 48 hours to 2 weeks. Pendants: 7–21 days. Chains: 7–21 days.
- What’s the price range? Pricing varies by materials, metal weight, design complexity, and gemstones. Do not invent a price list.
- How do I book an appointment? Online booking, or message `6479232533`.
- How do I clean my jewelry? Mild dish soap, warm water, soak 10–15 minutes, soft brush.
- Do you buy gold or silver? No. They design custom pieces instead.

Use a native `<details>` accordion.

## Build rules

- JSON templates only. Each section has a schema, presets, and no hardcoded colours outside CSS variables in `assets/dr-ice.css`.
- Mobile: header becomes a menu button. Quote cards go to one column. Filter drawer on the collection. Check 375px and 1440px.
- All images have alt text. Decorative SVGs are `aria-hidden`.
- Do not copy Lorem or the stray “2020 The Good Company” strings from the Figma footer dump. The live footer is the one in `references/shop.png`.
- Do not add a countdown, popup, or review app.
- Currency is CAD if the store is unset; do not convert prices in Liquid.

## Done when

`shopify theme check` has no errors. Homepage, about, collection, product, all three quote flows, appointment, and FAQ render with the local assets. A quote submission opens WhatsApp with the chosen options and also sends the contact form. Document any missing Figma image in `TODO.md` instead of substituting a random photo.
