"use client"

import * as React from "react"
import { Download, Plus, Trash2, Copy, ChevronUp, ChevronDown } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { InstagramSlideCanvas, ScaledSlide } from "@/components/instagram-slide"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  addSlide,
  duplicateSlide,
  MAX_SLIDES,
  MIN_SLIDES,
  moveSlide,
  removeSlide,
  SLIDE_THEMES,
  slideFilename,
  slugify,
  updateSlide,
  type CarouselDeck,
  type SlideTheme,
} from "@/lib/carousel-state"
import { cloneTemplate, TEMPLATES } from "@/lib/carousel-templates"
import { downloadDeckZip, downloadSlidePng } from "@/lib/export-slides"

export function CarouselStudio() {
  const [deck, setDeck] = React.useState<CarouselDeck>(() =>
    cloneTemplate("product-drop")
  )
  const [selectedId, setSelectedId] = React.useState(deck.slides[0]?.id ?? "")
  const [api, setApi] = React.useState<CarouselApi>()
  const [busy, setBusy] = React.useState<"slide" | "zip" | null>(null)
  const exportRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  const selectedIndex = Math.max(
    0,
    deck.slides.findIndex((slide) => slide.id === selectedId)
  )
  const selected = deck.slides[selectedIndex] ?? deck.slides[0]

  React.useEffect(() => {
    if (!api) return

    const sync = () => {
      const index = api.selectedScrollSnap()
      const id = deck.slides[index]?.id
      if (id) setSelectedId(id)
    }

    const frame = requestAnimationFrame(sync)
    api.on("select", sync)
    return () => {
      cancelAnimationFrame(frame)
      api.off("select", sync)
    }
  }, [api, deck.slides])

  function selectSlide(id: string) {
    setSelectedId(id)
    const index = deck.slides.findIndex((slide) => slide.id === id)
    if (index >= 0) api?.scrollTo(index)
  }

  function loadTemplate(id: string) {
    const next = cloneTemplate(id)
    setDeck(next)
    setSelectedId(next.slides[0]?.id ?? "")
    queueMicrotask(() => api?.scrollTo(0))
  }

  function patchSelected(patch: Partial<typeof selected>) {
    if (!selected) return
    setDeck((current) => ({
      ...current,
      slides: updateSlide(current.slides, selected.id, patch),
    }))
  }

  function handleAdd() {
    setDeck((current) => {
      const slides = addSlide(current.slides, selectedIndex)
      const created = slides[selectedIndex + 1] ?? slides[slides.length - 1]
      if (created) queueMicrotask(() => selectSlide(created.id))
      return { ...current, slides }
    })
  }

  function handleDuplicate() {
    if (!selected) return
    setDeck((current) => {
      const slides = duplicateSlide(current.slides, selected.id)
      const created = slides[selectedIndex + 1]
      if (created) queueMicrotask(() => selectSlide(created.id))
      return { ...current, slides }
    })
  }

  function handleRemove() {
    if (!selected) return
    setDeck((current) => {
      const slides = removeSlide(current.slides, selected.id)
      const nextSelected = slides[Math.min(selectedIndex, slides.length - 1)]
      if (nextSelected) queueMicrotask(() => selectSlide(nextSelected.id))
      return { ...current, slides }
    })
  }

  function handleMove(direction: -1 | 1) {
    const to = selectedIndex + direction
    setDeck((current) => ({
      ...current,
      slides: moveSlide(current.slides, selectedIndex, to),
    }))
    queueMicrotask(() => api?.scrollTo(to))
  }

  async function handleDownloadSlide() {
    if (!selected) return
    const element = exportRefs.current[selected.id]
    if (!element) return
    setBusy("slide")
    try {
      await downloadSlidePng(
        element,
        slideFilename(deck.name, selectedIndex, deck.slides.length)
      )
    } finally {
      setBusy(null)
    }
  }

  async function handleDownloadAll() {
    const slides = deck.slides.flatMap((slide, index) => {
      const element = exportRefs.current[slide.id]
      if (!element) return []
      return [{ element, filename: slideFilename(deck.name, index, deck.slides.length) }]
    })
    if (slides.length === 0) return
    setBusy("zip")
    try {
      await downloadDeckZip(slides, `${slugify(deck.name)}-carousel.zip`)
    } finally {
      setBusy(null)
    }
  }

  if (!selected) return null

  return (
    <div className="grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)_320px]">
      <aside className="space-y-5">
        <div>
          <p className="mb-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Templates
          </p>
          <div className="grid gap-2">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => loadTemplate(template.id)}
                className="rounded-xl border border-white/10 bg-card/50 px-3 py-2 text-left transition hover:border-amber-300/40 hover:bg-card"
              >
                <span className="block font-medium">{template.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {template.slides.length} slides
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Slides
            </p>
            <Badge variant="secondary">
              {deck.slides.length}/{MAX_SLIDES}
            </Badge>
          </div>
          <div className="grid gap-2">
            {deck.slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => selectSlide(slide.id)}
                className={`rounded-xl border px-3 py-2 text-left transition ${
                  slide.id === selected.id
                    ? "border-amber-300/70 bg-amber-300/10"
                    : "border-white/10 bg-card/40 hover:border-white/25"
                }`}
              >
                <span className="block text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  {String(index + 1).padStart(2, "0")} · {SLIDE_THEMES[slide.theme].label}
                </span>
                <span className="line-clamp-2 text-sm">{slide.title}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex flex-col items-center gap-5">
        <div className="w-full max-w-[420px] rounded-[36px] border border-white/10 bg-black p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between px-2 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            <span>Instagram</span>
            <span>1080 × 1080</span>
          </div>
          <Carousel className="w-full" opts={{ loop: false }} setApi={setApi}>
            <CarouselContent>
              {deck.slides.map((slide, index) => (
                <CarouselItem key={slide.id} className="flex justify-center">
                  <ScaledSlide size={360}>
                    <InstagramSlideCanvas
                      slide={slide}
                      index={index}
                      total={deck.slides.length}
                    />
                  </ScaledSlide>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 border-white/20 bg-black/50 text-white" />
            <CarouselNext className="right-1 border-white/20 bg-black/50 text-white" />
          </Carousel>
          <CarouselDotsHost api={api} className="mt-4" />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={handleAdd} disabled={deck.slides.length >= MAX_SLIDES}>
            <Plus /> Add slide
          </Button>
          <Button variant="secondary" onClick={handleDuplicate}>
            <Copy /> Duplicate
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleMove(-1)}
            disabled={selectedIndex === 0}
          >
            <ChevronUp /> Up
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleMove(1)}
            disabled={selectedIndex === deck.slides.length - 1}
          >
            <ChevronDown /> Down
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={deck.slides.length <= MIN_SLIDES}
          >
            <Trash2 /> Remove
          </Button>
        </div>
      </section>

      <aside className="space-y-4 rounded-2xl border border-white/10 bg-card/50 p-4">
        <div className="space-y-2">
          <Label htmlFor="deck-name">Deck name</Label>
          <Input
            id="deck-name"
            value={deck.name}
            onChange={(event) =>
              setDeck((current) => ({ ...current, name: event.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slide-eyebrow">Eyebrow</Label>
          <Input
            id="slide-eyebrow"
            value={selected.eyebrow}
            onChange={(event) => patchSelected({ eyebrow: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slide-title">Headline</Label>
          <Textarea
            id="slide-title"
            rows={3}
            value={selected.title}
            onChange={(event) => patchSelected({ title: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slide-body">Body</Label>
          <Textarea
            id="slide-body"
            rows={4}
            value={selected.body}
            onChange={(event) => patchSelected({ body: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slide-footer">Footer / handle</Label>
          <Input
            id="slide-footer"
            value={selected.footer}
            onChange={(event) => patchSelected({ footer: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select
            value={selected.theme}
            onValueChange={(value) => patchSelected({ theme: value as SlideTheme })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SLIDE_THEMES).map(([value, theme]) => (
                <SelectItem key={value} value={value}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={handleDownloadSlide} disabled={busy !== null}>
            <Download />
            {busy === "slide" ? "Exporting…" : "Download this slide"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownloadAll}
            disabled={busy !== null}
          >
            <Download />
            {busy === "zip" ? "Zipping…" : "Download all as ZIP"}
          </Button>
        </div>
      </aside>

      <div className="pointer-events-none fixed top-0 -left-[2400px]" aria-hidden>
        {deck.slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(node) => {
              exportRefs.current[slide.id] = node
            }}
          >
            <InstagramSlideCanvas
              slide={slide}
              index={index}
              total={deck.slides.length}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function CarouselDotsHost({
  api,
  className,
}: {
  api?: CarouselApi
  className?: string
}) {
  const [selected, setSelected] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    const sync = () => {
      setSelected(api.selectedScrollSnap())
      setCount(api.scrollSnapList().length)
    }
    const frame = requestAnimationFrame(sync)
    api.on("select", sync)
    api.on("reInit", sync)
    return () => {
      cancelAnimationFrame(frame)
      api.off("select", sync)
      api.off("reInit", sync)
    }
  }, [api])

  if (count <= 1) return null

  return (
    <div className={`flex justify-center gap-2 ${className ?? ""}`}>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          className={`h-2 rounded-full ${
            index === selected ? "w-6 bg-amber-300" : "w-2 bg-white/25"
          }`}
          onClick={() => api?.scrollTo(index)}
        />
      ))}
    </div>
  )
}
