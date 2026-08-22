"use client"

import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { InstagramSlideCanvas, ScaledSlide } from "@/components/instagram-slide"
import { getTemplate } from "@/lib/carousel-templates"

export function HeroCarousel() {
  const deck = getTemplate("product-drop")
  if (!deck) return null

  return (
    <Carousel
      className="w-full max-w-[440px]"
      opts={{ loop: true, align: "center" }}
      plugins={[Autoplay({ delay: 4200, stopOnInteraction: true })]}
    >
      <CarouselContent>
        {deck.slides.map((slide, index) => (
          <CarouselItem key={slide.id} className="flex justify-center">
            <ScaledSlide size={400}>
              <InstagramSlideCanvas
                slide={slide}
                index={index}
                total={deck.slides.length}
              />
            </ScaledSlide>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 z-20 size-9 border-white/25 bg-black/70 text-white hover:bg-black" />
      <CarouselNext className="right-2 z-20 size-9 border-white/25 bg-black/70 text-white hover:bg-black" />
      <CarouselDots className="mt-6" />
    </Carousel>
  )
}
