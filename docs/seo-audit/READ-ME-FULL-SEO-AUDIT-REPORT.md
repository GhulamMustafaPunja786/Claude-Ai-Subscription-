# Lift The City Supplements — Advanced Technical SEO Audit

> **No download needed.** Read this page directly on GitHub.

| | |
|---|---|
| **Website** | https://www.liftthecitysupplements.com/ |
| **Platform** | Shopify |
| **Audit date** | 2026-07-14 |
| **Overall score** | **58 / 100 — Needs Improvement** |

---

## One-sentence verdict

The store’s Shopify technical foundation is solid (HTTPS, sitemap, product schema), but it is held back by **missing collection/page SEO**, **incomplete local SEO**, an **empty blog**, and **too many thin or irrelevant indexable collections**.

---

## Top 10 fixes (do these first)

| # | Priority | Fix | Where in Shopify | Impact |
|---|----------|-----|------------------|--------|
| 1 | CRITICAL | Write unique Title + Meta Description for every important collection (Protein, Creatine, Pre-Workout, Fat Burners, brands) | Products → Collections → Search engine listing | High – rankings + CTR |
| 2 | CRITICAL | Delete, unpublish, or noindex empty/irrelevant collections (dog walking, renovation services, empty apparel, etc.) | Products → Collections | High – index quality |
| 3 | CRITICAL | Add LocalBusiness + Organization schema with full NAP (street, city, postal, phone, hours) + About/Store Location page | Theme JSON-LD + Pages | High – local pack + trust |
| 4 | CRITICAL | Fix product structured data: unique GTIN per variant (or remove bad GTINs); absolute offer URLs | Product barcodes + theme schema | High – rich results |
| 5 | HIGH | Add meta titles/descriptions to Contact/policies; add H1 on Contact; create About + FAQ pages | Online Store → Pages | Medium-High |
| 6 | HIGH | Noindex internal search pages (and preferably cart) | Theme search template robots | Medium – index bloat |
| 7 | HIGH | Publish blog buying guides (whey isolate, creatine, pre-workout, etc.) — blog currently has **0** articles | Online Store → Blog posts | High – long-term organic |
| 8 | HIGH | Improve titles: `PROTEIN` → `Buy Protein Powder in Toronto & Canada \| Lift The City` | Collection/Product SEO fields | High – CTR |
| 9 | MEDIUM | Fix image alt text (48 empty alts on homepage); allow pinch-zoom (remove `maximum-scale=1.0`) | Theme images + theme.liquid | Medium |
| 10 | MEDIUM | Reduce HTML weight; align shipping claims (**$149** in meta vs **$150** on banner) | Theme/apps + meta description | Medium |

---

## Score by area

| SEO Area | Score / 10 | Status | Plain-English meaning |
|----------|------------|--------|------------------------|
| Crawl & Indexation | 7 | OK | Google can find most pages, but junk/empty URLs and search pages can still get indexed |
| HTTPS / Host / Redirects | 8 | Good | HTTP→HTTPS and non-www→www work |
| Robots.txt & Sitemap | 7 | OK | Sitemap exists; empty/irrelevant collections are still listed |
| On-Page SEO (titles/metas/H1) | 3 | Critical | Almost all collections & content pages lack meta descriptions |
| Structured Data (Schema) | 5 | Needs work | Products have schema, but GTINs duplicated; missing LocalBusiness |
| Content & Information Architecture | 3 | Critical | No About/FAQ/Store page; blog empty; 238 collections for ~503 products |
| Local SEO (Toronto store) | 3 | Critical | Phone/email exist; street incomplete; no LocalBusiness schema |
| Images & Accessibility | 5 | Needs work | WebP used; many empty alts; viewport blocks zoom |
| Performance / Page Weight | 5 | Needs work | Fast TTFB, but HTML pages ~350–500 KB each |
| Internal Linking & UX Signals | 6 | OK | Brand/collection nav strong; weak content hubs |

---

## Site snapshot (crawl facts)

| Metric | Value | Notes |
|--------|-------|-------|
| Products in sitemap | 503 | All include images; lastmod current |
| Collections in sitemap | 238 | Too many vs product count; many thin/empty |
| Pages in sitemap | 3 | Contact, collection-bundle, official-partners only |
| Blog posts | 0 | Only `/blogs/news` exists — empty |
| Canonical host | `https://www.liftthecitysupplements.com` | Correct www preference |
| Homepage title | Protein, Creatine, And General Health! \| LiftTheCitySupplements.Com | 67 chars — decent |
| Homepage meta | Present (174 chars) | Mentions $149 GTA shipping; banner says $150 |
| Stack | Shopify + Cloudflare | HSTS on; Brotli compression |

---

## What's working well

| Item | Evidence |
|------|----------|
| HTTPS + HSTS | `strict-transport-security` present; HTTP 301→HTTPS |
| Preferred www host | non-www 301 → www |
| robots.txt quality | Disallows cart/checkout/account/filters/sort; points to sitemap |
| XML sitemap index | Products, collections, pages, blogs |
| Product JSON-LD | Product + Offer + Brand (+ AggregateRating on some) |
| Product meta descriptions | 39/40 sampled products had them |
| Canonical tags | Present; trailing-slash canon to clean URL |
| Fast TTFB | ~25–30 ms from audit location |
| Modern images | WebP via Shopify CDN |

---

## What's broken or weak

| Issue | Severity | Evidence |
|-------|----------|----------|
| Collections missing meta descriptions | CRITICAL | 65 of 66 sampled |
| Weak/generic titles | CRITICAL | Titles like PROTEIN, Products, News, Contact |
| Empty & irrelevant collections indexed | CRITICAL | e.g. gussy-company-inc-dog-walking, remodd-full-renovation-services |
| No About / FAQ / Store Location pages | CRITICAL | All returned 404 |
| Empty blog | HIGH | 0 articles |
| Incomplete local NAP + no LocalBusiness schema | CRITICAL | Contact shows Toronto ON M5V 4A6 only; no street |
| Duplicate GTIN across variants | HIGH | One product: 20 offers, 1 unique gtin12 reused |
| Relative Offer URLs in schema | MEDIUM | `/products/...` instead of absolute https:// |
| Search page indexable | HIGH | `/search` canonicalizes to itself; no noindex |
| Cart not noindexed via meta | MEDIUM | Blocked only by robots.txt |
| Homepage empty image alts | MEDIUM | 48 images with empty alt |
| Viewport disables zoom | MEDIUM | `maximum-scale=1.0` |
| Contact page missing H1 & meta | HIGH | Title "Contact", no description, H1 count 0 |
| Shipping claim inconsistency | MEDIUM | Meta $149 vs banner $150 |
| Very heavy HTML documents | MEDIUM | Homepage ~405 KB HTML |
| Almost no review schema coverage | MEDIUM | 1/40 sampled products had AggregateRating |

---

## Priority action plan (work top to bottom)

| Phase | Priority | Action | Where | Done looks like |
|-------|----------|--------|-------|-----------------|
| 1 | CRITICAL | Audit & clean collections | Admin → Collections | No empty/off-topic collections in sitemap/nav |
| 1 | CRITICAL | Write collection SEO titles & metas | Each Collection → Search engine listing | Every money collection has unique title + meta |
| 1 | CRITICAL | Add full store NAP + LocalBusiness schema | Pages + theme.liquid | Rich local entity visible to Google |
| 1 | CRITICAL | Fix product GTIN / barcode data | Products → variant barcode | Unique gtin per variant (or blank if unknown) |
| 2 | HIGH | Create About + FAQ pages | Online Store → Pages | Indexable About & FAQ with unique metas |
| 2 | HIGH | Fix Contact page SEO | Pages → Contact | H1, meta, street address, hours with times |
| 2 | HIGH | Noindex search (and cart via meta) | search.liquid / theme robots | Search URLs drop from Google over time |
| 2 | HIGH | Upgrade title tag patterns sitewide | Theme SEO defaults / fields | SERP titles show brand + keyword |
| 2 | HIGH | Launch content hub (blog) | Blog posts | Indexed articles linking to collections |
| 3 | MEDIUM | Fix image alt text | Theme / product media alt | No important product image without alt |
| 3 | MEDIUM | Remove `maximum-scale=1.0` from viewport | theme.liquid | Mobile pinch-zoom works |
| 3 | MEDIUM | Make Offer URLs absolute in JSON-LD | Product schema snippet | Rich Results Test clean |
| 3 | MEDIUM | Align shipping messaging | Banner + meta + shipping policy | One consistent free-shipping threshold |
| 3 | MEDIUM | Reduce HTML/app bloat | Theme sections + apps | Lighter HTML; better mobile LCP |
| 3 | MEDIUM | Grow review schema coverage | Review app | More products eligible for star ratings |
| 4 | LOW | Add Organization `sameAs` social links | Theme JSON-LD | Clearer entity / knowledge signals |
| 4 | LOW | Submit sitemap in GSC + monitor coverage | Google Search Console | Fewer junk/excluded URLs |

---

## Page-by-page findings

| URL | HTTP | Title | Meta desc? | H1 | Issues / Notes | Priority fix |
| --- | --- | --- | --- | --- | --- | --- |
| https://www.liftthecitysupplements.com/ | 200 | Protein, Creatine, And General Health! \| LiftTheCitySupplements.Com | Yes | Lift The City Supplements | 48 empty image alts; shipping $149 vs $150 mismatch; no Organization/LocalBusiness schema; heavy HTML; viewport max-scale=1 | Add Organization/LocalBusiness; fix alts; align shipping copy |
| .../products/pure-whey-isolate-2lb | 200 | Limitless Pharma Pure Whey Isolate 2LB & 5LB | Yes | Limitless Pharma Pure Whey Isolate 2LB & 5LB | Duplicate gtin12 on all variants; relative offer URLs; title missing store name; meta a bit long (>160) | Fix GTINs; shorten meta; append brand in title |
| .../products/pre-workout | 200 | Limitless Pharma BLOW Pre-Workout 50 Servings | Yes | Limitless Pharma BLOW Pre-Workout 50 Servings | Handle /products/pre-workout is overly generic for one brand SKU (cannibalization risk if others compete for 'pre-workout') | Consider more specific handle or canonical strategy; unique GTIN |
| .../products/pe-science-select-protein | 200 | PEScience Select Protein 27 & 55 Servings | Yes | PEScience Select Protein 27 & 55 Servings | Same GTIN reuse pattern; heavy HTML | Fix variant identifiers |
| .../collections/protein | 200 | PROTEIN | NO | PROTEIN | Critical money page with almost no SEO fields; no CollectionPage description schema | Write title+meta+intro copy |
| .../collections/all | 200 | Products | NO | All products | Generic title; pagination self-canonical on ?page=2 (normal for Shopify but watch duplicates) | Better title/meta or noindex if thin preference |
| .../collections/frontpage | 200 | Home page | NO | Home page | Should usually be hidden/noindex — duplicates homepage theme | Hide/noindex frontpage collection |
| .../collections/limitless-pharma | 200 | LIMITLESS PHARMA | NO | LIMITLESS PHARMA | Brand collection needs unique meta + supporting copy | Add SEO fields + brand blurb |
| .../collections/creatine | 404 | 404 Not Found | NO | (none) | Dead URL pattern users may guess; real collection is /collections/creatine-monohydrate | Add 301 from /creatine → /creatine-monohydrate |
| .../pages/contact | 200 | Contact | NO | MISSING | No H1; incomplete address (no street); no LocalBusiness | Full NAP + H1 + meta |
| .../blogs/news | 200 | News | NO | MISSING/empty | Empty blog index — thin page risk if indexed | Publish posts or noindex until content exists |
| .../search?q=protein | 200 | protein - Lift The City Supplements | NO | n/a | Canonical points to search URL; indexable thin result pages | Noindex all search templates |
| .../pages/about (and about-us) | 404 | — | — | — | Missing trust page | Create About Us page |
| .../pages/faq | 404 | — | — | — | Missing support/SEO content | Create FAQ |

---

## Collections cleanup list (66 sampled)

**Summary:** Missing meta description = **65/66** · Weak titles (<20 chars) = **56/66** · Empty (0 products) = **14/66** · Thin (1–3 products) = **21/66**

**Legend:** DELETE/HIDE = remove from index · WRITE SEO = add title+meta+copy · KEEP+OPTIMIZE = important commercial page

| Collection handle | Title | Title length | Has meta desc? | Products (≤250 API) | H1 | Recommended action | Suggested SEO title (example) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| flow-cbd-1 | FLOW CBD | 8 | NO | -1 |  | MERGE/THIN — write SEO or consolidate | Buy Flow Cbd in Canada \| Lift The City Supplements |
| flow-cbd | fLOW CBD | 8 | NO | 0 |  | DELETE/HIDE (empty) |  |
| forever-aesthetic | FOREVER AESTHETIC | 17 | NO | 0 |  | DELETE/HIDE or NOINDEX |  |
| gabba | GABA | 4 | NO | 0 |  | DELETE/HIDE (empty) |  |
| gummies | GUMMIES | 7 | NO | 0 |  | DELETE/HIDE (empty) |  |
| gussy-company-inc-dog-walking | GUSSY & COMPANY INC. DOG WALKING | 36 | NO | 0 |  | DELETE/HIDE or NOINDEX |  |
| gym-meal-prep-bags | MEAL PREP BAGS | 14 | NO | 0 |  | DELETE/HIDE (empty) |  |
| meal-replacement-1 | MEAL REPLACEMENT | 16 | NO | 0 |  | DELETE/HIDE (empty) |  |
| natural-path | Natural Path | 12 | NO | 0 |  | DELETE/HIDE (empty) |  |
| protein-almond-butter | PROTEIN ALMOND BUTTER | 21 | NO | 0 |  | DELETE/HIDE (empty) |  |
| remodd-full-renovation-services | REMODD FULL RENOVATION SERVICES | 31 | NO | 0 |  | DELETE/HIDE or NOINDEX |  |
| shirts | SHIRTS | 6 | NO | 0 |  | DELETE/HIDE (empty) |  |
| smart-solutions | SMART SOLUTIONS | 15 | NO | 0 |  | DELETE/HIDE (empty) |  |
| sugar-free-dressings | SUGAR FREE DRESSINGS | 20 | NO | 0 |  | DELETE/HIDE (empty) |  |
| womens-apparel | WOMEN'S APPAREL | 19 | NO | 0 |  | DELETE/HIDE (empty) |  |
| built | BUILT | 5 | NO | 1 | BUILT | MERGE/THIN — write SEO or consolidate | Buy Built in Canada \| Lift The City Supplements |
| cla | CLA | 3 | NO | 1 | CLA | MERGE/THIN — write SEO or consolidate | Buy Cla in Canada \| Lift The City Supplements |
| das-labs | DAS LABS | 8 | NO | 1 | DAS LABS | MERGE/THIN — write SEO or consolidate | Buy Das Labs in Canada \| Lift The City Supplements |
| digestive-aid | FIBER | 5 | NO | 1 | FIBER | MERGE/THIN — write SEO or consolidate | Buy Fiber in Canada \| Lift The City Supplements |
| eaas-stimulants | EAAs + STIMULANTS | 17 | NO | 1 | EAAs + STIMULANTS | MERGE/THIN — write SEO or consolidate | Buy Eaas + Stimulants in Canada \| Lift The City Supplements |
| frontpage | Home page | 9 | NO | 1 | Home page | DELETE/HIDE or NOINDEX |  |
| isopure | ISOPURE | 7 | NO | 1 | ISOPURE | MERGE/THIN — write SEO or consolidate | Buy Isopure in Canada \| Lift The City Supplements |
| protein-cookies | PROTEIN COOKIES | 15 | NO | 1 | PROTEIN COOKIES | MERGE/THIN — write SEO or consolidate | Buy Protein Cookies in Canada \| Lift The City Supplements |
| diuretics | DIURETICS | 9 | NO | 2 | DIURETICS | MERGE/THIN — write SEO or consolidate | Buy Diuretics in Canada \| Lift The City Supplements |
| general | GENERAL | 7 | NO | 2 | GENERAL | MERGE/THIN — write SEO or consolidate | Buy General in Canada \| Lift The City Supplements |
| goli | GOLI | 4 | NO | 2 | GOLI | MERGE/THIN — write SEO or consolidate | Buy Goli in Canada \| Lift The City Supplements |
| mushrooms | MUSHROOMS | 9 | NO | 2 | MUSHROOMS | MERGE/THIN — write SEO or consolidate | Buy Mushrooms in Canada \| Lift The City Supplements |
| redcon1 | REDCON1 | 7 | NO | 2 | REDCON1 | MERGE/THIN — write SEO or consolidate | Buy Redcon1 in Canada \| Lift The City Supplements |
| spreads | SPREADS | 7 | NO | 2 | SPREADS | MERGE/THIN — write SEO or consolidate | Buy Spreads in Canada \| Lift The City Supplements |
| tested-nutrition | TESTED NUTRITION | 16 | NO | 2 | TESTED NUTRITION | MERGE/THIN — write SEO or consolidate | Buy Tested Nutrition in Canada \| Lift The City Supplements |
| whey-concentrate | WHEY CONCENTRATE | 16 | NO | 2 | WHEY CONCENTRATE | MERGE/THIN — write SEO or consolidate | Buy Whey Concentrate in Canada \| Lift The City Supplements |
| beef | BEEF | 4 | NO | 3 | BEEF | MERGE/THIN — write SEO or consolidate | Buy Beef in Canada \| Lift The City Supplements |
| carbohydrates | CARBOHYDRATES | 13 | NO | 3 | CARBOHYDRATES | MERGE/THIN — write SEO or consolidate | Buy Carbohydrates in Canada \| Lift The City Supplements |
| preworkout-elements | PREWORKOUT ELEMENTS | 19 | NO | 3 | PREWORKOUT ELEMENTS | MERGE/THIN — write SEO or consolidate | Buy Preworkout Elements in Canada \| Lift The City Supplements |
| protein-shakes | PROTEIN SHAKES | 14 | NO | 3 | PROTEIN SHAKES | MERGE/THIN — write SEO or consolidate | Buy Protein Shakes in Canada \| Lift The City Supplements |
| top-5-fat-burners | TOP FAT BURNERS | 15 | NO | 3 | TOP FAT BURNERS | MERGE/THIN — write SEO or consolidate | Buy Top Fat Burners in Canada \| Lift The City Supplements |
| gda-glucose-disposal-agents | METABOLISM SUPPORT | 18 | NO | 4 | METABOLISM SUPPORT | WRITE SEO | Buy Metabolism Support in Canada \| Lift The City Supplements |
| new-collection | New Products | 12 | NO | 4 | New Products | WRITE SEO | Buy New Products in Canada \| Lift The City Supplements |
| womens-health | WOMEN'S HORMONE | 19 | NO | 4 | WOMEN'S HORMONE | WRITE SEO | Buy Women'S Hormone in Canada \| Lift The City Supplements |
| optimum-nutrition | OPTIMUM NUTRITION | 17 | NO | 5 | OPTIMUM NUTRITION | WRITE SEO | Buy Optimum Nutrition in Canada \| Lift The City Supplements |
| progressive | PROGRESSIVE | 11 | NO | 5 | PROGRESSIVE | WRITE SEO | Buy Progressive in Canada \| Lift The City Supplements |
| rule-1 | RULE 1 | 6 | NO | 5 | RULE 1 | WRITE SEO | Buy Rule 1 in Canada \| Lift The City Supplements |
| therapy-and-skin-care | THERAPY AND HYGIENE | 19 | NO | 5 | THERAPY AND HYGIENE | WRITE SEO | Buy Therapy And Hygiene in Canada \| Lift The City Supplements |
| top-5-bcaa-eaa | TOP BCAA/EAA | 12 | NO | 5 | TOP BCAA/EAA | WRITE SEO | Buy Top Bcaa/Eaa in Canada \| Lift The City Supplements |
| mutant | MUTANT | 6 | NO | 6 | MUTANT | WRITE SEO | Buy Mutant in Canada \| Lift The City Supplements |
| pantry | PANTRY | 6 | NO | 7 | PANTRY | WRITE SEO | Buy Pantry in Canada \| Lift The City Supplements |
| hormone-stress | HORMONE CARE | 12 | NO | 10 | HORMONE CARE | KEEP+OPTIMIZE — WRITE SEO | Buy Hormone Care in Canada \| Lift The City Supplements |
| pe-science | PESCIENCE | 9 | NO | 10 | PESCIENCE | KEEP+OPTIMIZE — WRITE SEO | Buy Pescience in Canada \| Lift The City Supplements |
| all-fat-burners | FAT BURNING ESSENTIALS | 22 | YES | 11 | FAT BURNING ESSENTIALS | KEEP+OPTIMIZE — WRITE SEO | Buy Fat Burning Essentials in Canada \| Lift The City Supplements |
| collagen | COLLAGEN | 8 | NO | 11 | COLLAGEN | KEEP+OPTIMIZE — WRITE SEO | Buy Collagen in Canada \| Lift The City Supplements |
| liver-detox | ORGAN HEALTH | 12 | NO | 11 | ORGAN HEALTH | KEEP+OPTIMIZE — WRITE SEO | Buy Organ Health in Canada \| Lift The City Supplements |
| top-5-protein-isolates | TOP PROTEIN ISOLATES (LACTOSE FREE) | 35 | NO | 11 | TOP PROTEIN ISOLATES (LACTOSE FREE) | KEEP+OPTIMIZE — WRITE SEO | Buy Top Protein Isolates (Lactose Free) in Canada \| Lift The City Supp |
| multivitamin-for-men | MEN'S MULTIVITAMINS | 23 | NO | 12 | MEN'S MULTIVITAMINS | KEEP+OPTIMIZE — WRITE SEO | Buy Men'S Multivitamins in Canada \| Lift The City Supplements |
| vitamins | VITAMINS | 8 | NO | 13 | VITAMINS | KEEP+OPTIMIZE — WRITE SEO | Buy Vitamins in Canada \| Lift The City Supplements |
| creatine-monohydrate | CREATINE | 8 | NO | 14 | CREATINE | KEEP+OPTIMIZE — WRITE SEO | Buy Creatine in Canada \| Lift The City Supplements |
| nootropics | COGNITIVE HEALTH | 16 | NO | 14 | COGNITIVE HEALTH | KEEP+OPTIMIZE — WRITE SEO | Buy Cognitive Health in Canada \| Lift The City Supplements |
| sleep | SLEEP SUPPORT | 13 | NO | 14 | SLEEP SUPPORT | KEEP+OPTIMIZE — WRITE SEO | Buy Sleep Support in Canada \| Lift The City Supplements |
| digestive-aid-1 | DIGESTION | 9 | NO | 15 | DIGESTION | KEEP+OPTIMIZE — WRITE SEO | Buy Digestion in Canada \| Lift The City Supplements |
| greens-superfoods | GREENS, REDS, BLUES & MUSHROOMS | 35 | NO | 15 | GREENS, REDS, BLUES & MUSHROOMS | KEEP+OPTIMIZE — WRITE SEO | Buy Greens, Reds, Blues & Mushrooms in Canada \| Lift The City Suppleme |
| fat-burners | FAT BURNING | 11 | NO | 16 | FAT BURNING | KEEP+OPTIMIZE — WRITE SEO | Buy Fat Burning in Canada \| Lift The City Supplements |
| magnum | MAGNUM | 6 | NO | 16 | MAGNUM | KEEP+OPTIMIZE — WRITE SEO | Buy Magnum in Canada \| Lift The City Supplements |
| recovery | ESSENTIAL AMINO ACIDS & ELECTROLYTES | 40 | NO | 23 | ESSENTIAL AMINO ACIDS & ELECTROLYTES | KEEP+OPTIMIZE — WRITE SEO | Buy Essential Amino Acids & Electrolytes in Canada \| Lift The City Sup |
| front-page-listing | FRONT PAGE LISTING | 18 | NO | 45 | FRONT PAGE LISTING | DELETE/HIDE or NOINDEX | Buy Front Page Listing in Canada \| Lift The City Supplements |
| protein | PROTEIN | 7 | NO | 61 | PROTEIN | KEEP+OPTIMIZE — WRITE SEO | Buy Protein in Canada \| Lift The City Supplements |
| all | Products | 8 | NO | 250 | All products | KEEP+OPTIMIZE — WRITE SEO | Buy Products in Canada \| Lift The City Supplements |
| best-selling-collection | Best selling products | 21 | NO | 250 | Best selling products | KEEP+OPTIMIZE — WRITE SEO | Buy Best Selling Products in Canada \| Lift The City Supplements |

---

## Technical checklist (pass / fail)

| Category | Check | Current status | Pass? | Notes / evidence |
| --- | --- | --- | --- | --- |
| Crawlability | robots.txt exists & references sitemap | Present; Sitemap line OK | PASS | https://www.liftthecitysupplements.com/robots.txt |
| Crawlability | XML sitemap accessible | Sitemap index with 5 child maps | PASS | products/collections/pages/blogs/agentic |
| Crawlability | Sitemap free of junk URLs | Empty & irrelevant collections included | FAIL | dog-walking, renovation, empty apparel collections in sitemap |
| Crawlability | Homepage accidentally in product sitemap | Homepage loc found in products sitemap | WARN | Shopify quirk — monitor |
| Indexation | Important templates indexable | Products/collections indexable | PASS | No accidental sitewide noindex |
| Indexation | Search results noindexed | /search is indexable (self-canonical) | FAIL | Add noindex to search template |
| Indexation | Cart/checkout protected | robots.txt disallows; cart meta robots missing | WARN | Prefer meta noindex on cart too |
| Indexation | Pagination handling | page=2 self-canonical; sort_by canonicalizes to clean URL | PASS/WARN | Sort handling good; pagination OK for Shopify |
| URL / Host | HTTPS enforced | HTTP 301 → HTTPS | PASS | Checked |
| URL / Host | www canonical host | non-www → www | PASS | x-redirect-reason: canonical_host_redirection |
| URL / Host | Trailing slash consistency | Both resolve 200; canonical without slash | WARN | Canonical mitigates; 301 would be cleaner |
| URL / Host | Case sensitivity | /PRODUCTS/... → 404 | WARN | Normal on Shopify; avoid mixed-case links |
| On-Page | Unique title tags | Many generic short titles on collections/pages | FAIL | PROTEIN / Products / Contact / News |
| On-Page | Meta descriptions present | Collections/pages mostly missing; products mostly present | FAIL | 65/66 collections missing |
| On-Page | Single clear H1 | Home/product/collection OK; Contact/Blog missing | WARN | Fix Contact + Blog templates |
| On-Page | Heading hierarchy sensible | H6 used for shipping blurbs on home | WARN | Don't use H6 for non-outline text |
| Schema | Product schema | Present with Offer/Brand | PASS | Good baseline |
| Schema | Valid unique identifiers (GTIN/SKU) | Same gtin12 repeated across variants | FAIL | Fix barcodes or omit invalid GTIN |
| Schema | Absolute offer URLs | Relative URLs in offers | FAIL | Update liquid schema |
| Schema | Organization schema | Missing on homepage | FAIL | Add Organization |
| Schema | LocalBusiness schema | Missing | FAIL | Critical for Toronto store |
| Schema | BreadcrumbList | Present | PASS | Home → page |
| Schema | Review/AggregateRating coverage | Rare (1/40 sample) | WARN | Scale review collection |
| Content | About page | 404 | FAIL | Create |
| Content | FAQ page | 404 | FAIL | Create |
| Content | Blog activity | 0 posts | FAIL | Publish guides |
| Content | Collection uniqueness / thin pages | Many 0–3 product collections | FAIL | Clean IA |
| Local | NAP completeness | Phone+email yes; street missing; hours incomplete | FAIL | Contact page |
| Local | Consistent shipping claims | $149 meta vs $150 banner | FAIL | Align copy |
| Images | Alt attributes | Many empty on homepage | FAIL | 48 empty alts |
| Images | Next-gen formats | WebP yes | PASS | Shopify CDN |
| Images | Sitemap image entries | 503/503 products have image in sitemap | PASS | Good |
| Performance | TTFB | ~28ms measured | PASS | Edge/CDN strong |
| Performance | HTML document weight | 350–500KB HTML common | FAIL | App/section bloat likely |
| Performance | Compression | br (Brotli) | PASS | Good |
| Security | HSTS | max-age≈3 months | WARN | Consider longer max-age once stable |
| Security | CSP / X-Frame-Options | frame-ancestors none; XFO DENY | PASS | Good hardening |
| Accessibility | Viewport zoom allowed | maximum-scale=1.0 set | FAIL | Remove max/min scale locks |
| Mobile | Responsive viewport meta present | Yes (but zoom locked) | WARN | Fix scale |
| Intl | Hreflang | None (single locale en-CA) | PASS | OK if Canada-only |
| Social | Open Graph tags | Present on home | PASS | og:image 1200x628 |
| Social | Twitter card type | summary (not large image) | WARN | Use summary_large_image |

---

## Products sample (40 products)

**Summary:** Missing meta desc = **1/40** · Product schema = **40/40** · AggregateRating = **1/40** · Avg title length ≈ **37** chars (often missing store brand name)

| Handle | Title | Title length | Has meta desc? | Review schema? | Notes |
| --- | --- | --- | --- | --- | --- |
| pre-workout | Limitless Pharma BLOW Pre-Workout 50 Servings | 45 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| allmax-agmatine-sulfate | Allmax Agmatine 45g | 19 | YES | NO | Title short — add variant/benefit/brand keywords; No review stars schema; Consider appending \| Lift The City |
| allmax-l-glutamine | Allmax L-Glutamine 400g &amp; 1000g | 35 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| atp-omega-pure | ATPLab Omega Pure 120 Softgels | 30 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| atp-labs-iso | ATPLab 100% Whey Protein Isolate 900g | 37 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| progressive-vegessential-all-in-one | Progressive Vegessential All In One 840g (Clearance) | 52 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| pvl-isogold | PVL Isogold 340g, 1.85LB &amp; 5LB | 34 | YES | YES | Consider appending \| Lift The City |
| himalaya-ashwagandha | Himalaya Ashwagandha 60 &amp; 90 Capsules | 41 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| dymatize-iso100-protein | Dymatize Iso100 Protein 1.34LB &amp; 5LB | 40 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| pvl-water-tight-90-capsules | PVL WaterTight 90 Capsules | 26 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| lifttech-padded-leather-belt-4 | Lifttech Padded Leather Belt 4&quot; &amp; 6&quot; | 50 | YES | NO | No review stars schema |
| quest-mini-peanut-butter-cups | Quest Mini Peanut Butter Cups 128g | 34 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| unisex-gold-ambition-premium-midweight-hoodie | Unisex &quot;Gold Ambition&quot; Premium Midweight Hoodie | 57 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| beyond-yourself-amrap | Beyond Yourself AMRAP 400g | 26 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| unisex-ltc-vice-edition-premium-t-shirt-pre-order | Unisex LTC &quot;Vice Edition&quot; Premium T-Shirt | 51 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| atplab-ultra-omega-3 | ATPLab Ultra Omega 3 60 Capsules | 32 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| copy-of-owala-freesip-32-oz | Owala FreeSip 24oz | 18 | YES | NO | Title short — add variant/benefit/brand keywords; No review stars schema; Consider appending \| Lift The City |
| salus-gallexier-herbal-bitters-liquid-250ml | Salus Gallexier Herbal Bitters Liquid 250ml | 43 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| ehplabs-oxyshred-248-324g | EHPlabs Oxyshred Ultra Concentration 264-294g | 45 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| atplab-inflam-control-120-capsules | ATPlab Inflam Control 120 Capsules | 34 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| alora-naturals-alpha-gpc | Alora Naturals Alpha GPC 60 Capsules | 36 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| atplab-trans-resveratrol-99-60-capsules | ATPLab Trans Resveratrol 99% 60 Capsules | 40 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| alora-naturals-joint-recovery-extra-strength-150-capsules | Alora Naturals Joint Recovery Extra Strength 150 Capsules | 57 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| pvl-proh20 | PVL PRO H20 255g &amp; 612g | 27 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| hd-muscle | HD Muscle MultiHD 120 Capsules | 30 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| becks-broth-22g-35g | Beck&#39;s Broth 21g-25g (Clearance) | 36 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| omaha-protein-popcorn-124-224g | OPP Omaha Protein Popcorn 62g-124g | 34 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| aor-nattokinase-30-capsules | AOR Nattokinase 30 Capsules | 27 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| sinfit-protein-pancake-waffle-mix | Sinfit Nutrition Protein Pancake &amp; Waffle Mix 612g | 54 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| lifttech-elite-wrist-wrap-mens | Lifttech Elite Wrist Wrap Mens Medium | 37 | YES | NO | No review stars schema |
| pure-le-iron-60-capsules | Pure-Le Lipofective Iron 60 Capsules | 36 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| aor-l-glutamine-120-capsules | AOR L-Glutamine 120 Capsules | 28 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| nutridom-organic-moringa-leaf-500mg-120-capsules | Nutridom Organic Moringa Leaf 500mg 120 Capsules | 48 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| perfect-sports-mag-z | Perfect Sports Mag-Z 90 Capsules | 32 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| nutridom-vitamin-k2-120-capsules | Nutridom Vitamin K2 120 Capsules | 32 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| rabeko-protein-chocolate-spread-250g | Rabeko Protein Chocolate Spread 250g | 36 | NO | NO | Add meta description; No review stars schema; Consider appending \| Lift The City |
| cover | Covertape Premium Kinesiology Tape | 34 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| hd-muscle-prehd-essential-preworkout-369g | HD Muscle PreHD Essential Preworkout 369g | 41 | YES | NO | No review stars schema; Consider appending \| Lift The City |
| aor-p-5-p-60-capsules | AOR P-5-P 60 Capsules | 21 | YES | NO | Title short — add variant/benefit/brand keywords; No review stars schema; Consider appending \| Lift The City |
| jacksons-avocado-oil-sweet-potato-chips-sea-salt-142g | Jackson&#39;s Avocado Oil Sweet Potato Chips \| Sea Salt 142g | 60 | YES | NO | No review stars schema; Consider appending \| Lift The City |

---

## Structured data & LocalBusiness example

| Page type | Schema found | Missing / problems | Recommended |
|-----------|--------------|--------------------|-------------|
| Homepage | WebSite + SearchAction, BreadcrumbList | No Organization, No LocalBusiness | Organization + LocalBusiness + WebSite |
| Product | Product, Offer[], Brand, Breadcrumb; AggregateRating sometimes | Duplicate GTIN; relative offer URLs; limited reviews | Fix identifiers; absolute Offer URL |
| Collection | BreadcrumbList only | No CollectionPage description | CollectionPage + SEO copy |
| Contact | BreadcrumbList only | No LocalBusiness | LocalBusiness / ContactPage |
| Blog | BreadcrumbList only | No posts / no BlogPosting | Blog + Article when content exists |

### GTIN problem (simple)

Each product flavour/size should have its **own** barcode (GTIN/UPC). Right now the store often repeats **one** barcode across many variants. Google treats that as bad data.

**Fix:** Shopify → Products → variant → **Barcode** field. If you do not know the real barcode, **leave it blank**.

### Example LocalBusiness JSON-LD (customize, then paste in theme)

```json
{
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyStore",
  "name": "Lift The City Supplements",
  "url": "https://www.liftthecitysupplements.com/",
  "telephone": "+1-647-973-3793",
  "email": "ltc@liftthecitysupplements.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ADD FULL STREET ADDRESS HERE",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "postalCode": "M5V 4A6",
    "addressCountry": "CA"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "10:00",
    "closes": "18:00"
  }],
  "areaServed": ["Toronto","Greater Toronto Area","Canada"],
  "sameAs": ["https://www.instagram.com/liftthecitysupplements/"]
}
```

---

## Glossary (plain English)

| Term | Meaning |
|------|---------|
| Technical SEO | Making sure Google can find, understand, and trust your pages |
| Crawl budget | How much time Google spends scanning your site — don't waste it on junk pages |
| noindex | Tells Google not to show the page in search |
| Canonical | The main URL version you want Google to count |
| Meta description | The blurb under your blue Google title — boosts clicks |
| Title tag | The clickable blue headline in Google |
| Schema / JSON-LD | Code that explains products/store/reviews to Google |
| GTIN / UPC | Product barcode — must be unique per variant |
| NAP | Name, Address, Phone — must be consistent for local SEO |
| Thin content | Pages with little unique value (empty collections, empty blog) |
| CTR | % of searchers who click your result |

---

## Free tools to verify fixes

| Tool | Use for |
|------|---------|
| [Google Search Console](https://search.google.com/search-console) | Sitemap, coverage, queries |
| [Rich Results Test](https://search.google.com/test/rich-results) | Validate Product / LocalBusiness schema |
| [PageSpeed Insights](https://pagespeed.web.dev/) | Mobile speed after theme cleanup |
| Shopify Admin → Search engine listing preview | Titles & metas |
| `site:liftthecitysupplements.com` in Google | Spot indexed junk/search/empty pages |
| [Google Business Profile](https://business.google.com/) | Match NAP to website |

### After cleanup, check these in Google

- `site:www.liftthecitysupplements.com/collections/gussy` → should disappear
- `site:www.liftthecitysupplements.com/search` → should disappear
- `site:www.liftthecitysupplements.com/blogs/news` → should list real articles after publishing
- `"Lift The City Supplements" Toronto` → brand + local presence improves

---

## Audit limits

This audit used live public crawls (HTML, robots.txt, sitemaps, product/collection JSON). PageSpeed Insights API quota was unavailable during the run — re-check at pagespeed.web.dev after fixes. Shopify admin and Google Search Console were not accessed.

---

**End of report.** Work the Priority Action Plan from Phase 1 downward.
