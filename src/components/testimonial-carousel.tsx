"use client"

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const QUOTES = [
  {
    quote:
      "Walked in for isolate, walked out with a stack that actually matches my split. Fort York team does not upsell junk.",
    name: "Amina K.",
    detail: "Orange Theory Fort York",
  },
  {
    quote:
      "The lactose-free whey is the first one that does not wreck my stomach. Reordered the 5LB the same week.",
    name: "Chris P.",
    detail: "CityPlace",
  },
  {
    quote:
      "Local delivery actually showed up the next day. That is the whole reason I stopped ordering from the States.",
    name: "Jordan M.",
    detail: "Liberty Village",
  },
]

export function TestimonialCarousel() {
  return (
    <Carousel className="w-full" opts={{ loop: true, align: "center" }}>
      <CarouselContent>
        {QUOTES.map((item) => (
          <CarouselItem key={item.name}>
            <Card className="border-white/10 bg-card/60">
              <CardContent className="px-8 py-10 sm:px-12">
                <p className="font-display text-3xl leading-tight tracking-wide text-balance uppercase sm:text-4xl">
                  {item.quote}
                </p>
                <p className="mt-8 text-sm tracking-[0.18em] text-amber-300 uppercase">
                  {item.name} · {item.detail}
                </p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 border-white/15 bg-background/80" />
      <CarouselNext className="right-2 border-white/15 bg-background/80" />
      <CarouselDots className="mt-6" />
    </Carousel>
  )
}
