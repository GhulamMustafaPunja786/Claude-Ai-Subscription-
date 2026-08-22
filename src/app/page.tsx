import Link from "next/link"
import { SiteFooter, SiteHeader } from "@/components/site-header"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCarousel } from "@/components/product-carousel"
import { TestimonialCarousel } from "@/components/testimonial-carousel"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="home" />
      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.28em] text-amber-300 uppercase">
              Instagram + website carousels
            </p>
            <h1 className="mt-4 font-display text-6xl leading-[0.9] tracking-wide uppercase sm:text-7xl">
              Make carousels that swipe like a restock drop.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              A reusable carousel component and a studio that exports 1080×1080
              Instagram slides. Seeded with Lift The City product, education,
              community, and promo decks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/studio">Open the studio</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#products">See product slider</a>
              </Button>
            </div>
          </div>
          <HeroCarousel />
        </section>

        <section
          id="products"
          className="border-y border-white/10 bg-black/20 py-16"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <p className="text-xs tracking-[0.28em] text-amber-300 uppercase">
              Multi-card carousel
            </p>
            <h2 className="mt-3 font-display text-5xl tracking-wide uppercase">
              Floor favorites
            </h2>
            <p className="mt-3 mb-8 max-w-xl text-muted-foreground">
              The same carousel primitive, showing more than one card at a
              time. Swipe, use arrows, or tap the dots.
            </p>
            <ProductCarousel />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs tracking-[0.28em] text-amber-300 uppercase">
            Quote carousel
          </p>
          <h2 className="mt-3 mb-8 font-display text-5xl tracking-wide uppercase">
            From the community
          </h2>
          <TestimonialCarousel />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
