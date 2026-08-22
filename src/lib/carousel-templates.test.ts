import { describe, expect, it } from "vitest"
import { MAX_SLIDES, MIN_SLIDES } from "@/lib/carousel-state"
import { cloneTemplate, getTemplate, TEMPLATES } from "@/lib/carousel-templates"

describe("carousel templates", () => {
  it("ships at least one ready-to-post deck", () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(3)
  })

  it("keeps every template inside Instagram carousel limits", () => {
    for (const template of TEMPLATES) {
      expect(template.slides.length).toBeGreaterThanOrEqual(MIN_SLIDES)
      expect(template.slides.length).toBeLessThanOrEqual(MAX_SLIDES)
      expect(template.name.length).toBeGreaterThan(0)
      for (const slide of template.slides) {
        expect(slide.title.length).toBeGreaterThan(0)
        expect(slide.theme).toBeTruthy()
      }
    }
  })

  it("clones a template with fresh slide ids", () => {
    const original = getTemplate("product-drop")
    expect(original).toBeDefined()
    const clone = cloneTemplate("product-drop")
    expect(clone.slides).toHaveLength(original!.slides.length)
    expect(clone.id).not.toBe(original!.id)
    expect(clone.slides[0]?.id).not.toBe(original!.slides[0]?.id)
    expect(clone.slides[0]?.title).toBe(original!.slides[0]?.title)
  })

  it("falls back to the first template for unknown ids", () => {
    const clone = cloneTemplate("does-not-exist")
    expect(clone.slides[0]?.title).toBe(TEMPLATES[0]?.slides[0]?.title)
  })
})
