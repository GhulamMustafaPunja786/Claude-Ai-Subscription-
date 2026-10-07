# Header only

Paste the block below into the AI that is building the Shopify theme. It must change the header and nothing else.

```text
Build only the site header for the Dr. Ice Shopify theme. Do not create or edit the footer, homepage, product page, collection page, or quote wizards.

Match the black bar in references/shop.png and references/about-hero.png. The header is the same on every page, including the homepage. It is a solid black bar, not transparent over the hero photo.

## Bar

- Full width, background #0a0a0a, height about 72px on desktop.
- One row. Vertically center every item.
- Horizontal padding about 40px on desktop, 16px on mobile.
- Font for the links and logo: a clean sans-serif, white, about 14px. Not a script font.

## Left: logo

- A small white outlined diamond, then the words DR. ICE in white, letter-spaced, uppercase.
- The diamond is drawn in the header markup. Do not use assets/icons/icon-diamond.svg. That file is a blue circle, not the logo.
- The logo links to /.
- Alt text: Dr. Ice.

## Center: navigation

Show these links, in this order, in white:

1. Home → /
2. Shop → /collections
3. About Us → /pages/about
4. Instant Pendant Quote → /pages/instant-pendant-quote
5. Instant Chain Quote → /pages/instant-chain-quote
6. Instant Ring Quote → /pages/instant-ring-quote
7. Faqs → /pages/faq

The link for the current page has a thin white underline. No other link is underlined. No dropdowns.

## Right

- A pill button labeled Book Appointment. Background #4062C3, white text, no border, fully rounded, padding about 10px 18px. It links to /pages/book-appointment.
- To the right of the button, a white cart icon linking to the cart. Use assets/icons/icon-cart.svg if the stroke stays white on the black bar. Otherwise draw a simple white cart.
- A small blue circle (#4062C3) sits on the top-right of the cart and shows {{ cart.item_count }}. Hide the circle when the count is 0.

## Mobile, under 990px

- Keep the logo on the left.
- Keep the cart icon on the right.
- Hide the text links and the Book Appointment button.
- Add a white menu button. It opens a panel with the same seven links, in the same order, then the Book Appointment button.
- The current page is still underlined. Escape and a close button close the panel. The rest of the page does not scroll while the panel is open.

## Shopify

- Edit only the header section (sections/header.liquid, or the header group the theme already uses) and a header stylesheet such as assets/dr-ice-header.css.
- Load that stylesheet from the header. Do not restyle the footer or the page body.
- Cart count must use the real Shopify cart object.
- Keep the theme’s existing cart drawer behavior if it already has one. Only restyle the icon and the count.
- Run shopify theme check and fix every error it reports in the header files.

## Done when

On references/shop.png and references/about-hero.png, the header matches: black bar, diamond + DR. ICE, the seven links, blue Book Appointment button, cart with count. About Us is underlined on the About page. Shop is underlined on a collection page. Nothing below the header has changed.
```
