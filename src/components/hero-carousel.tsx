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
      className="w-full"
      opts={{ loop: true, align: "center" }}
      plugins={[Autoplay({ delay: 4200, stopOnInteraction: true })]}
    >
      <CarouselContent>
        {deck.slides.map((slide, index) => (
          <CarouselItem key={slide.id} className="flex justify-center">
            <ScaledSlide size={360} className="sm:hidden">
              <InstagramSlideCanvas
                slide={slide}
                index={index}
                total={deck.slides.length}
              />
            </ScaledSlide>
            <ScaledSlide size={440} className="hidden sm:block lg:hidden">
              <InstagramSlideCanvas
                slide={slide}
                index={index}
                total={deck.slides.length}
              />
            </ScaledSlide>
            <ScaledSlide size={520} className="hidden lg:block">
              <InstagramSlideCanvas
                slide={slide}
                index={index}
                total={deck.slides.length}
              />
            </ScaledSlide>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 border-white/20 bg-black/50 text-white hover:bg-black/70 sm:left-4" />
      <CarouselNext className="right-2 border-white/20 bg-black/50 text-white hover:bg-black/70 sm:right-4" />
      <CarouselDots className="mt-6" />
    </Carousel>
  )
}
