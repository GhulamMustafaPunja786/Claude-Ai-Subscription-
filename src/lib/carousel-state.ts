export type SlideTheme = "midnight" | "gold" | "cream" | "ember" | "forest"

export type CarouselSlide = {
  id: string
  eyebrow: string
  title: string
  body: string
  footer: string
  theme: SlideTheme
}

export type CarouselDeck = {
  id: string
  name: string
  description: string
  slides: CarouselSlide[]
}

export const MIN_SLIDES = 1
export const MAX_SLIDES = 10

export const SLIDE_THEMES: Record<
  SlideTheme,
  {
    label: string
    background: string
    eyebrow: string
    title: string
    body: string
    footer: string
    rule: string
    stamp: string
  }
> = {
  midnight: {
    label: "Midnight",
    background: "linear-gradient(160deg, #0b0b0c 0%, #1a1408 55%, #0b0b0c 100%)",
    eyebrow: "#E8B84A",
    title: "#F7F3EA",
    body: "rgba(247, 243, 234, 0.78)",
    footer: "#E8B84A",
    rule: "#E8B84A",
    stamp: "rgba(232, 184, 74, 0.12)",
  },
  gold: {
    label: "Gold",
    background: "linear-gradient(160deg, #E8B84A 0%, #C9922A 100%)",
    eyebrow: "#2A1D08",
    title: "#14110C",
    body: "#3A2A10",
    footer: "#14110C",
    rule: "#14110C",
    stamp: "rgba(20, 17, 12, 0.08)",
  },
  cream: {
    label: "Cream",
    background: "linear-gradient(160deg, #F4EDE0 0%, #E8DCC6 100%)",
    eyebrow: "#8A6A1F",
    title: "#17140F",
    body: "#3C3428",
    footer: "#8A6A1F",
    rule: "#C9A24A",
    stamp: "rgba(20, 17, 12, 0.06)",
  },
  ember: {
    label: "Ember",
    background: "linear-gradient(160deg, #2A0C0C 0%, #5A1610 50%, #1A0808 100%)",
    eyebrow: "#F0B429",
    title: "#FFF4E8",
    body: "rgba(255, 244, 232, 0.78)",
    footer: "#F0B429",
    rule: "#F0B429",
    stamp: "rgba(240, 180, 41, 0.12)",
  },
  forest: {
    label: "Forest",
    background: "linear-gradient(160deg, #0E1A14 0%, #163024 60%, #0C1611 100%)",
    eyebrow: "#C8E39A",
    title: "#F3F7EC",
    body: "rgba(243, 247, 236, 0.78)",
    footer: "#C8E39A",
    rule: "#C8E39A",
    stamp: "rgba(200, 227, 154, 0.12)",
  },
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `slide_${Math.random().toString(36).slice(2, 11)}`
}

export function createBlankSlide(theme: SlideTheme = "midnight"): CarouselSlide {
  return {
    id: createId(),
    eyebrow: "New slide",
    title: "Write a punchy headline",
    body: "Keep this to one or two short lines so it stays readable on Instagram.",
    footer: "@yourbrand",
    theme,
  }
}

export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0
  return Math.min(Math.max(index, 0), length - 1)
}

export function addSlide(
  slides: CarouselSlide[],
  afterIndex = slides.length - 1,
  theme?: SlideTheme
): CarouselSlide[] {
  if (slides.length >= MAX_SLIDES) return slides

  const insertAt = clampIndex(afterIndex, slides.length) + 1
  const next = [...slides]
  next.splice(insertAt, 0, createBlankSlide(theme ?? slides[afterIndex]?.theme ?? "midnight"))
  return next
}

export function removeSlide(slides: CarouselSlide[], id: string): CarouselSlide[] {
  if (slides.length <= MIN_SLIDES) return slides
  return slides.filter((slide) => slide.id !== id)
}

export function duplicateSlide(slides: CarouselSlide[], id: string): CarouselSlide[] {
  if (slides.length >= MAX_SLIDES) return slides

  const index = slides.findIndex((slide) => slide.id === id)
  if (index === -1) return slides

  const copy: CarouselSlide = { ...slides[index], id: createId() }
  const next = [...slides]
  next.splice(index + 1, 0, copy)
  return next
}

export function moveSlide(
  slides: CarouselSlide[],
  fromIndex: number,
  toIndex: number
): CarouselSlide[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= slides.length ||
    toIndex >= slides.length
  ) {
    return slides
  }

  const next = [...slides]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function updateSlide(
  slides: CarouselSlide[],
  id: string,
  patch: Partial<Omit<CarouselSlide, "id">>
): CarouselSlide[] {
  return slides.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide))
}

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "carousel"
  )
}

export function slideFilename(deckName: string, index: number, total: number): string {
  const n = String(index + 1).padStart(2, "0")
  const of = String(total).padStart(2, "0")
  return `${slugify(deckName)}-${n}-of-${of}.png`
}
