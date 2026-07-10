# Technical SEO Audit — Lift The City Supplements

**Site:** https://www.liftthecitysupplements.com/  
**Platform:** Shopify  
**Audit date:** July 10, 2026  
**Scope:** Full-site technical SEO (crawlability, indexation, on-page, schema, local, content architecture, UX signals)

---

## Executive summary

The store is crawlable and has solid Shopify foundations (HTTPS, canonical host, sitemap, product schema on PDPs). The biggest ranking and conversion gaps are **weak / non-commercial titles**, **missing or incomplete schema for local + organization + collections**, **almost no meta descriptions on collection/page templates**, **thin or empty content pages (no About, no FAQ, empty blog)**, and **collection keyword cannibalization** across 236 collections.

| Area | Score (1–10) | Verdict |
|------|--------------|---------|
| Crawlability & indexation | 8 | Strong Shopify defaults |
| On-page titles & metas | 3 | Homepage + collections fail conversion SEO |
| Schema markup | 4 | Product OK; Local/Org/Collection/FAQ missing or incomplete |
| Content & topical authority | 2 | Empty blog, no About/FAQ, thin collections |
| Local SEO (Toronto store) | 3 | NAP on Contact only; no LocalBusiness schema |
| Technical hygiene | 6 | Mixed `http` OG images, viewport zoom lock, GTIN issues |
| Internal linking / IA | 5 | Over-fragmented collections; partner junk collections indexed |

**Priority order:** (1) Homepage + collection titles/metas → (2) LocalBusiness + Organization schema → (3) Fix product schema errors → (4) Prune/noindex thin collections → (5) About + FAQ + blog content.

---

## What’s working (keep)

- HTTPS with HSTS; `http://` and non-www correctly 301 to `https://www.liftthecitysupplements.com/`
- `robots.txt` present with sitemap reference
- XML sitemap index live: **~504 products**, **236 collections**, **3 pages**, **1 blog**
- Homepage has `canonical`, Open Graph, Twitter tags
- Product pages output `Product` + `BreadcrumbList` JSON-LD (with offers, brand, aggregateRating)
- Homepage has `WebSite` + `SearchAction` schema
- Single H1 on homepage and product pages
- Most images use `loading="lazy"`

---

## Critical findings (fix + replace + reason)

### 1) Homepage meta title is not conversion-focused

| | |
|--|--|
| **Status** | Needs replacement |
| **Current** | `Protein, Creatine, And General Health! \| LiftTheCitySupplements.Com` |
| **Replace with** | `Buy Protein, Creatine & Pre-Workout in Toronto \| Lift The City Supplements` |
| **Alt A/B test** | `Toronto Supplement Store — Free Local Delivery Over $150 \| Lift The City` |
| **Reason** | Current title is vague, uses a weak exclamation, and brands with a raw domain (`LiftTheCitySupplements.Com`) instead of the real brand. It does not state commercial intent (“buy”), primary categories, or the Toronto local differentiator. Google and shoppers both prefer clear benefit + location + brand (~50–60 characters). |

**Also update to match:**

- `og:title` → same as new title  
- `twitter:title` → same as new title  
- Browser tab brand consistency: use `Lift The City Supplements`, not the `.Com` domain string  

---

### 2) Homepage meta description is outdated and inconsistent

| | |
|--|--|
| **Status** | Needs replacement |
| **Current** | `Free Greater Toronto Area shipping on orders over $149 on whey protein, pre-workout, mass gainer, creatine, fat burners, vitamins, ZMA and BCAAs for recovery, energy & sleep.` |
| **Replace with** | `Shop authentic protein, creatine, pre-workout & vitamins at Lift The City Supplements in Toronto. Free Toronto delivery over $150 · Free Canada-wide shipping over $250. In-store pickup available.` |
| **Reason** | Meta says “shipping over **$149**” but the live site banner says **$150 Toronto / $250 Canada-wide**. Inconsistent offers hurt trust and Quality Score in ads. The rewrite aligns the offer, adds brand + pickup, and keeps primary keywords without stuffing. Aim for ~150–160 characters. |

---

### 3) Schema markup — incomplete (not fully missing, but critical types are missing)

Homepage currently has only:

- `WebSite` + `SearchAction`
- `BreadcrumbList` (Home only)

**Missing (must add):**

#### A) Organization schema (sitewide in `theme.liquid` / head)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Lift The City Supplements",
  "url": "https://www.liftthecitysupplements.com/",
  "logo": "https://www.liftthecitysupplements.com/cdn/shop/files/logo_on-white-with-icon_-_Copy_96x96.png",
  "email": "ltc@liftthecitysupplements.com",
  "telephone": "+1-647-973-3793",
  "sameAs": [
    "https://www.instagram.com/YOUR_HANDLE",
    "https://www.facebook.com/YOUR_PAGE"
  ]
}
```

**Reason:** Helps Google connect brand entity, logo, and social profiles for Knowledge Panel / brand SERP features. Currently no `Organization` JSON-LD exists.

#### B) LocalBusiness / Store schema (homepage + contact)

```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Lift The City Supplements",
  "image": "https://cdn.shopify.com/s/files/1/0621/0899/1720/files/image_6483441_5.jpg",
  "url": "https://www.liftthecitysupplements.com/",
  "telephone": "+1-647-973-3793",
  "email": "ltc@liftthecitysupplements.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "50 Fort York Blvd",
    "addressLocality": "Toronto",
    "addressRegion": "ON",
    "postalCode": "M5V 4A6",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "REPLACE_WITH_EXACT",
    "longitude": "REPLACE_WITH_EXACT"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "11:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "11:00",
      "closes": "REPLACE_SAT_CLOSE"
    }
  ],
  "areaServed": [
    { "@type": "City", "name": "Toronto" },
    { "@type": "AdministrativeArea", "name": "Ontario" }
  ]
}
```

**Reason:** You have a real retail location (50 Fort York Blvd, Toronto) and phone, but **no LocalBusiness/Store schema**. Local pack + “supplement store near me” visibility depends on this + Google Business Profile consistency.

#### C) Collection pages — add `CollectionPage` + `ItemList`

Collections currently only have `BreadcrumbList`. Add:

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Whey Protein",
  "url": "https://www.liftthecitysupplements.com/collections/whey-protein",
  "description": "Shop whey protein isolate, concentrate & blends in Toronto with free local delivery over $150.",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://www.liftthecitysupplements.com/products/EXAMPLE"
      }
    ]
  }
}
```

**Reason:** Helps Google understand category hubs as topical landing pages, not empty shells.

#### D) FAQPage schema (after you publish an FAQ page)

**Reason:** FAQ rich results can win extra SERP space for queries like “does Lift The City deliver in Toronto?” / “free shipping threshold”.

#### E) Product schema fixes (PDPs already have Product — repair quality)

| Issue found | Fix |
|-------------|-----|
| Offer `url` is relative (`/products/...`) | Use absolute `https://www.liftthecitysupplements.com/products/...?variant=` |
| Same `gtin12` repeated across all variants | Use real unique barcode per variant, or omit GTIN if unknown (invalid GTINs can suppress rich results) |
| `og:image` uses `http://` | Force `https://` |
| `twitter:card` = `summary` | Change to `summary_large_image` for better social CTR |
| Product meta description often truncated at ~320 chars of raw body copy | Write unique 150–160 char commercial metas per product (or template: `{Brand} {Product} — {benefit}. Buy in Toronto at Lift The City.`) |
| Product titles often missing brand/store modifier | Pattern: `{Brand} {Product Name} \| Lift The City Supplements` (keep under ~60 chars) |

**Example product title rewrite**

| Current | Replace with | Reason |
|---------|--------------|--------|
| `Limitless Pharma Pure Whey Isolate 2LB & 5LB` | `Limitless Pharma Pure Whey Isolate (2LB & 5LB) \| Lift The City` | Adds brand-in-SERP consistency and store modifier; improves CTR vs generic manufacturer-only titles |

---

### 4) Collection titles are not SEO or conversion ready

Almost every sampled collection title is a raw label with **no brand, no location, no intent**.

| Page | Current title | Replace with | Reason |
|------|---------------|--------------|--------|
| `/collections/protein` | `PROTEIN` | `Buy Protein Powder in Toronto \| Whey, Plant & More` | “PROTEIN” alone wastes the title tag; no CTR hook |
| `/collections/whey-protein` | `WHEY PROTEIN` | `Whey Protein Isolate & Concentrate \| Lift The City` | Targets commercial whey queries + brand |
| `/collections/creatine-monohydrate` | `CREATINE` | `Creatine Monohydrate Powder & Capsules \| Lift The City` | Matches search wording; “CREATINE” is too thin |
| `/collections/fat-burners` | `FAT BURNING` | `Fat Burners & Thermogenics (Stim & Stim-Free)` | Aligns title to query language shoppers use |
| `/collections/bcaas` | `BCAA` | `BCAAs & EAAs for Recovery \| Lift The City Toronto` | Expands matching + local modifier |
| `/collections/allmax-nutrition` | `ALLMAX` | `ALLMAX Supplements Canada \| Official Selection at Lift The City` | Brand + geo commerce intent |
| `/collections/frontpage` | `Home page` | **Noindex** or redirect to `/` | Duplicate of homepage; wastes crawl budget |

**Collection meta descriptions:** Missing on nearly all collections sampled (only rare exceptions like `all-fat-burners`).  

**Template to roll out in Shopify (Search engine listing):**

> Shop {Collection} at Lift The City Supplements in Toronto. Authentic brands, expert staff, free Toronto delivery over $150 and free Canada-wide shipping over $250.

**Reason:** Without titles/descriptions, Google often auto-generates snippets from thin nav text — lower CTR and weaker category rankings.

---

### 5) Contact / utility page titles

| Page | Current | Replace with | Reason |
|------|---------|--------------|--------|
| `/pages/contact` | `Contact` | `Contact & Store Location — 50 Fort York Blvd, Toronto` | Puts NAP keywords in title for local SEO |
| `/blogs/news` | `News` | Until content exists: **noindex, follow** — or rename to `Supplement Guides & News \| Lift The City` after publishing | Empty blog index is a thin URL |

**Contact page also missing H1** (uses H2 “CONTACT US” only).  
**Replace structure with:** one H1 `Contact Lift The City Supplements — Toronto Store`, then address/hours.

---

## High-priority technical issues

### Crawl / indexation

| Issue | Detail | Action |
|-------|--------|--------|
| **236 collections** | Many overlap (`protein`, `whey-protein`, `whey-isolate`, `top-5-protein-isolates`, etc.) | Keep 1 primary hub per intent; consolidate or `noindex` near-duplicates |
| **Partner / junk collections indexed** | e.g. `remodd-full-renovation-services`, `orange-theory-fort-york` with ~1 product | `noindex` or remove from sitemap; these dilute topical relevance |
| **Empty blog** | `/blogs/news` has **0 articles** | Noindex until 8–12 useful posts exist |
| **No About / FAQ pages** | `/pages/about`, `/pages/faq` → 404 | Create both (E-E-A-T + schema opportunities) |
| **Only 3 indexable pages** | contact, collection-bundle, partners | Too few supporting pages for a local retailer |

### On-page / content

| Issue | Action |
|-------|--------|
| Collection pages have **no unique descriptive copy** | Add 150–300 words unique intro per money collection (protein, creatine, pre-workout, fat burners) |
| Homepage H1 is brand-only (`Lift The City Supplements`) | Keep brand H1 **or** use `Toronto’s Supplement Store — Protein, Creatine & Pre-Workout` if you want keyword H1; do not stuff both |
| **48 homepage images with empty `alt=""`** | Add descriptive alts for product/category images; keep empty only for pure decorative icons |
| Meta description vs banner offer mismatch ($149 vs $150/$250) | Align all public copy + ads + schema `Offer` shipping text |

### Technical hygiene

| Issue | Action |
|-------|--------|
| `og:image` on products often `http://` | Force HTTPS in theme social meta |
| Viewport includes `maximum-scale=1.0` | Remove zoom lock (accessibility; can affect UX signals) |
| HTML homepage ~414 KB with **63 scripts** | Audit apps; defer non-critical JS; hurts LCP/INP |
| Twitter card `summary` | Use `summary_large_image` |
| `lang="en"` while `content-language: en-CA` | Prefer `lang="en-CA"` |
| No `hreflang` | OK if Canada-only; document that intentionally |

### Local SEO

| Issue | Action |
|-------|--------|
| NAP only on Contact | Repeat consistent NAP in footer sitewide |
| No LocalBusiness schema | Add Store schema (see above) |
| Confirm Google Business Profile | Categories: Vitamin & Supplements Store / Nutritionist Shop; same address/phone/hours |
| Add embed map + “Get directions” on Contact | Strengthens local relevance |

---

## Recommended information architecture (money pages)

Focus crawl equity on these hubs (unique title + meta + 200+ words + internal links):

1. `/` — Toronto supplement store homepage  
2. `/collections/whey-protein` (or `/collections/protein` — pick **one** primary)  
3. `/collections/creatine-monohydrate`  
4. `/collections/stim-preworkouts` + stim-free hub  
5. `/collections/fat-burners`  
6. `/collections/plant` (plant protein)  
7. `/collections/vitamins-minerals`  
8. `/pages/contact` — local landing  
9. `/pages/about` — new  
10. `/pages/faq` — new  

**Noindex or delete:** empty partner collections, `frontpage`, duplicate “top-5” pages if they cannibalize main hubs (or turn top-5 into editorial guides with unique copy).

---

## Content gaps (authority)

Publish these before expecting competitive organic growth:

1. **About Us** — founders, store story, authenticity/testing stance, Toronto community  
2. **FAQ** — shipping thresholds, pickup, returns, Canada-only shipping  
3. **Blog / guides** (rename from “News”), examples:  
   - Best whey isolate in Canada 2026  
   - Creatine monohydrate dosage guide  
   - Stim vs stim-free pre-workout  
   - Toronto local delivery — how it works  
4. **Shipping & delivery landing page** reinforcing $150 / $250 offers  

---

## Implementation checklist (Shopify)

### Quick wins (theme / admin — same day)

- [ ] Update homepage **title** + **meta description** in Online Store → Preferences / homepage SEO  
- [ ] Sync OG/Twitter titles to the new homepage title  
- [ ] Fix homepage offer copy ($150 / $250) everywhere  
- [ ] Add Organization + Store JSON-LD in `theme.liquid`  
- [ ] Contact page: H1 + SEO title + meta description  
- [ ] Change Twitter card to `summary_large_image`  
- [ ] Force HTTPS on `og:image`  
- [ ] Remove `maximum-scale=1.0` from viewport  

### Week 1

- [ ] Bulk-update SEO titles/descriptions for top 20 collections  
- [ ] Noindex thin/partner/empty collections + empty blog  
- [ ] Fix product Offer absolute URLs + GTIN cleanup on bestsellers  
- [ ] Add footer NAP + link to Contact  

### Week 2–4

- [ ] Write collection intros for money categories  
- [ ] Publish About + FAQ (+ FAQ schema)  
- [ ] Launch 4–6 blog guides; internal-link to collections/PDPs  
- [ ] Prune collection count toward a clean taxonomy  
- [ ] App/script performance pass (Core Web Vitals)  

### Measurement

- [ ] Google Search Console property verified for `www`  
- [ ] Submit `https://www.liftthecitysupplements.com/sitemap.xml`  
- [ ] Track queries: `protein toronto`, `creatine toronto`, brand terms, category terms  
- [ ] Rich Results Test for homepage (Store) + 5 PDPs (Product)  

---

## Sample copy pack (ready to paste)

### Homepage

- **Title:** `Buy Protein, Creatine & Pre-Workout in Toronto | Lift The City Supplements`  
- **Meta:** `Shop authentic protein, creatine, pre-workout & vitamins at Lift The City Supplements in Toronto. Free Toronto delivery over $150 · Free Canada-wide shipping over $250. In-store pickup available.`  

### Contact

- **Title:** `Contact & Store Location — 50 Fort York Blvd, Toronto`  
- **Meta:** `Visit Lift The City Supplements at 50 Fort York Blvd, Toronto ON M5V 4A6. Call (647) 973-3793 or email ltc@liftthecitysupplements.com. Open Mon–Fri 11am–8pm.`  

### Whey protein collection

- **Title:** `Whey Protein Isolate & Concentrate | Lift The City Toronto`  
- **Meta:** `Shop whey isolate, concentrate and blends from top brands. Free Toronto local delivery over $150. Pickup at our Fort York store.`  

---

## Severity roadmap

| Priority | Items |
|----------|--------|
| P0 | Homepage title/meta; offer consistency; LocalBusiness + Organization schema |
| P1 | Collection titles/metas (top 20); product schema URL/GTIN/HTTPS fixes; Contact H1/SEO |
| P2 | Noindex thin collections + empty blog; About + FAQ |
| P3 | Content program; collection pruning; performance/app audit |

---

## Method notes

Audited via live HTTP fetches of homepage, product, collection, contact, blog, policies, `robots.txt`, and XML sitemaps (products/collections/pages/blogs). Schema and meta parsed from rendered HTML. This is a technical + on-page audit; it does not replace Search Console click data, backlink analysis, or Core Web Vitals field metrics from CrUX/PSI.

---

*Prepared for Lift The City Supplements — technical SEO action document.*
