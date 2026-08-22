import {
  createId,
  type CarouselDeck,
  type CarouselSlide,
} from "@/lib/carousel-state"

const FOOTER = "@liftthecitysupplements"

function slide(
  partial: Omit<CarouselSlide, "id"> & { id?: string }
): CarouselSlide {
  return { id: partial.id ?? createId(), ...partial }
}

export const TEMPLATES: CarouselDeck[] = [
  {
    id: "product-drop",
    name: "Product drop",
    description: "Five slides to launch a protein or creatine hero product.",
    slides: [
      slide({
        eyebrow: "Toronto drop",
        title: "Whey isolate that actually is lactose free",
        body: "Top isolates, plant proteins, and pre-workouts — picked for the city that trains before sunrise.",
        footer: FOOTER,
        theme: "midnight",
      }),
      slide({
        eyebrow: "01 · Isolate",
        title: "Limitless Pharma Pure Whey",
        body: "2LB & 5LB bags. Clean mix. From $79.97. Built for high-protein days without the bloat.",
        footer: FOOTER,
        theme: "gold",
      }),
      slide({
        eyebrow: "02 · Strength",
        title: "Kre-Alkalyn that stays buffered",
        body: "EFX powder & capsules. 500g or 120–192 caps. From $39.97 for the people who track every set.",
        footer: FOOTER,
        theme: "cream",
      }),
      slide({
        eyebrow: "03 · Engine",
        title: "Batch 27 when you need the stim",
        body: "TC Nutrition, 40 servings, $54.97. Pair it with a stim-free option for late sessions.",
        footer: FOOTER,
        theme: "ember",
      }),
      slide({
        eyebrow: "Shop LTC",
        title: "Free Toronto delivery over $150",
        body: "Canada-wide free over $250. Or grab it at 50 Fort York Blvd. We ship inside Canada only.",
        footer: FOOTER,
        theme: "midnight",
      }),
    ],
  },
  {
    id: "education",
    name: "Education",
    description: "A swipe-through that teaches one idea, then sends people to the shop.",
    slides: [
      slide({
        eyebrow: "LTC lab notes",
        title: "Creatine is not a stim. Stop treating it like one.",
        body: "It fills muscle water and supports ATP. You take it on rest days too.",
        footer: FOOTER,
        theme: "forest",
      }),
      slide({
        eyebrow: "The habit",
        title: "3–5g daily. Same time. Every day.",
        body: "Miss a workout? Still take it. Consistency beats loading protocols for most people.",
        footer: FOOTER,
        theme: "cream",
      }),
      slide({
        eyebrow: "The myth",
        title: "It will not wreck your kidneys if you are healthy.",
        body: "Drink water. If you have a medical condition, talk to your clinician — not a comment section.",
        footer: FOOTER,
        theme: "midnight",
      }),
      slide({
        eyebrow: "Shop the stack",
        title: "Buffered or micronized. We carry both.",
        body: "Ask the floor team at Fort York which form matches your stomach and your training split.",
        footer: FOOTER,
        theme: "gold",
      }),
    ],
  },
  {
    id: "community",
    name: "Community",
    description: "Invite people into the Lift The City Instagram community.",
    slides: [
      slide({
        eyebrow: "Lift The City",
        title: "Join the LTC community on Instagram",
        body: "Protein, creatine, and general health — posted for Toronto lifters, not algorithm fluff.",
        footer: FOOTER,
        theme: "gold",
      }),
      slide({
        eyebrow: "What you get",
        title: "Drops. Restocks. Honest product notes.",
        body: "When Batch 27 is back, you hear it here first. Same for isolate bags that actually sell out.",
        footer: FOOTER,
        theme: "midnight",
      }),
      slide({
        eyebrow: "How to join",
        title: "Follow @liftthecitysupplements",
        body: "Then walk in at 50 Fort York Blvd, Mon–Fri 10–6. Tell the team what you are training for.",
        footer: FOOTER,
        theme: "cream",
      }),
    ],
  },
  {
    id: "promo",
    name: "Promo",
    description: "Shipping, pickup, and a hard close for the week.",
    slides: [
      slide({
        eyebrow: "This week",
        title: "Train here. We will get the tub to you.",
        body: "Local Toronto delivery in 24–48 hours on qualifying orders. In-store pickup whenever you want.",
        footer: FOOTER,
        theme: "ember",
      }),
      slide({
        eyebrow: "The numbers",
        title: "Free local over $150. Free Canada over $250.",
        body: "Before tax. Does not apply on promotion days. We ship exclusively within Canada.",
        footer: FOOTER,
        theme: "midnight",
      }),
      slide({
        eyebrow: "The close",
        title: "Build your cart. We will handle the last mile.",
        body: "liftthecitysupplements.com · 50 Fort York Blvd · +1 647-973-3793",
        footer: FOOTER,
        theme: "gold",
      }),
    ],
  },
  {
    id: "blank",
    name: "Blank deck",
    description: "Two empty slides so you can write your own story.",
    slides: [
      slide({
        eyebrow: "Slide 01",
        title: "Hook them in one line",
        body: "The first slide has to earn the swipe. Make a claim they can feel.",
        footer: "@yourbrand",
        theme: "midnight",
      }),
      slide({
        eyebrow: "Slide 02",
        title: "Then tell them what to do",
        body: "A product, a link, a handle, or a store. Do not leave the last slide quiet.",
        footer: "@yourbrand",
        theme: "gold",
      }),
    ],
  },
]

export function getTemplate(id: string): CarouselDeck | undefined {
  return TEMPLATES.find((template) => template.id === id)
}

export function cloneTemplate(id: string): CarouselDeck {
  const template = getTemplate(id) ?? TEMPLATES[0]

  return {
    ...template,
    id: `${template.id}-${createId().slice(0, 8)}`,
    slides: template.slides.map((item) => ({ ...item, id: createId() })),
  }
}
