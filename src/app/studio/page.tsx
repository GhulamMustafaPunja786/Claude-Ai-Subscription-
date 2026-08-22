import { CarouselStudio } from "@/components/carousel-studio"
import { SiteFooter, SiteHeader } from "@/components/site-header"

export const metadata = {
  title: "Studio · Carousel Studio",
  description: "Write, preview, and export Instagram carousel slides.",
}

export default function StudioPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="studio" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs tracking-[0.28em] text-amber-300 uppercase">
            Instagram deck builder
          </p>
          <h1 className="mt-3 font-display text-5xl tracking-wide uppercase">
            Pick a template. Edit the copy. Download the slides.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Exports 1080×1080 PNGs, one slide or a ZIP of the whole deck. Built
            for Lift The City restocks — swap the handle if you want another
            brand.
          </p>
        </div>
        <CarouselStudio />
      </main>
      <SiteFooter />
    </div>
  )
}
