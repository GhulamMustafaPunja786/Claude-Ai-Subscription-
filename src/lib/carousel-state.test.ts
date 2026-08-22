import { describe, expect, it } from "vitest"
import {
  addSlide,
  clampIndex,
  createBlankSlide,
  duplicateSlide,
  MAX_SLIDES,
  MIN_SLIDES,
  moveSlide,
  removeSlide,
  slideFilename,
  slugify,
  updateSlide,
  type CarouselSlide,
} from "@/lib/carousel-state"

function deck(count: number): CarouselSlide[] {
  return Array.from({ length: count }, (_, index) => ({
    ...createBlankSlide("midnight"),
    title: `Slide ${index + 1}`,
  }))
}

describe("clampIndex", () => {
  it("keeps a valid index", () => {
    expect(clampIndex(2, 5)).toBe(2)
  })

  it("clamps to the last slide", () => {
    expect(clampIndex(9, 3)).toBe(2)
  })

  it("returns 0 for an empty list", () => {
    expect(clampIndex(2, 0)).toBe(0)
  })
})

describe("slide mutations", () => {
  it("adds a slide after the selected index", () => {
    const slides = deck(2)
    const next = addSlide(slides, 0)
    expect(next).toHaveLength(3)
    expect(next[1]?.title).toBe("Write a punchy headline")
    expect(next[0]?.id).toBe(slides[0]?.id)
  })

  it("refuses to grow past MAX_SLIDES", () => {
    const slides = deck(MAX_SLIDES)
    expect(addSlide(slides)).toHaveLength(MAX_SLIDES)
    expect(duplicateSlide(slides, slides[0]!.id)).toHaveLength(MAX_SLIDES)
  })

  it("refuses to shrink below MIN_SLIDES", () => {
    const slides = deck(MIN_SLIDES)
    expect(removeSlide(slides, slides[0]!.id)).toHaveLength(MIN_SLIDES)
  })

  it("duplicates a slide next to the original", () => {
    const slides = deck(2)
    const next = duplicateSlide(slides, slides[0]!.id)
    expect(next).toHaveLength(3)
    expect(next[1]?.title).toBe(slides[0]?.title)
    expect(next[1]?.id).not.toBe(slides[0]?.id)
  })

  it("moves a slide forward and backward", () => {
    const slides = deck(3)
    const forward = moveSlide(slides, 0, 2)
    expect(forward.map((slide) => slide.title)).toEqual([
      "Slide 2",
      "Slide 3",
      "Slide 1",
    ])
    expect(moveSlide(forward, 2, 0).map((slide) => slide.title)).toEqual([
      "Slide 1",
      "Slide 2",
      "Slide 3",
    ])
  })

  it("updates only the matching slide", () => {
    const slides = deck(2)
    const next = updateSlide(slides, slides[1]!.id, { title: "Restock Friday" })
    expect(next[0]?.title).toBe("Slide 1")
    expect(next[1]?.title).toBe("Restock Friday")
    expect(next[1]?.id).toBe(slides[1]?.id)
  })
})

describe("filenames", () => {
  it("slugifies messy deck names", () => {
    expect(slugify("  LTC Product Drop!! ")).toBe("ltc-product-drop")
    expect(slugify("")).toBe("carousel")
  })

  it("builds padded export names", () => {
    expect(slideFilename("Product drop", 0, 5)).toBe("product-drop-01-of-05.png")
  })
})
