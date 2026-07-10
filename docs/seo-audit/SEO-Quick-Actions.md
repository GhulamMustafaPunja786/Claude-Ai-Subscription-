# Lift The City — SEO Quick Action List

Use this with the full audit: `LiftTheCitySupplements-Technical-SEO-Audit.md`

## Replace these now

| Asset | Current | Replace with | Why |
|-------|---------|--------------|-----|
| Homepage title | `Protein, Creatine, And General Health! \| LiftTheCitySupplements.Com` | `Buy Protein, Creatine & Pre-Workout in Toronto \| Lift The City Supplements` | Not commercial; domain-style brand; no Toronto/buy intent |
| Homepage meta | Mentions free shipping over **$149** | Free Toronto delivery over **$150** · Canada-wide over **$250** + categories + pickup | Offer mismatch vs live banner; weak CTR |
| `/collections/protein` title | `PROTEIN` | `Buy Protein Powder in Toronto \| Whey, Plant & More` | One-word titles do not rank or convert |
| `/collections/whey-protein` title | `WHEY PROTEIN` | `Whey Protein Isolate & Concentrate \| Lift The City` | Needs modifiers + brand |
| `/collections/creatine-monohydrate` title | `CREATINE` | `Creatine Monohydrate Powder & Capsules \| Lift The City` | Match search language |
| `/pages/contact` title | `Contact` | `Contact & Store Location — 50 Fort York Blvd, Toronto` | Local SEO NAP in title |

## Schema to add

| Schema | Where | Status |
|--------|-------|--------|
| `Organization` | Sitewide | **Missing — add** |
| `Store` / `LocalBusiness` | Home + Contact | **Missing — add** |
| `WebSite` + `SearchAction` | Home | Present — keep |
| `Product` + offers | PDPs | Present — **fix** absolute URLs, GTINs, HTTPS images |
| `CollectionPage` + `ItemList` | Collections | **Missing — add** |
| `FAQPage` | New FAQ page | **Missing — add after content** |
| `BreadcrumbList` | Most templates | Present — keep |

## Noindex / clean up

- Empty `/blogs/news` (0 posts)
- `/collections/frontpage` (homepage duplicate)
- Partner/junk collections with 1–2 products (e.g. renovation partner collections)
- Near-duplicate category URLs after you pick one primary hub per keyword

## Create (404 today)

- `/pages/about`
- `/pages/faq`
