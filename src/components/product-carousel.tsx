"use client"

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PRODUCTS = [
  {
    tag: "Isolate",
    name: "Limitless Pharma Pure Whey",
    detail: "Lactose-free isolate · 2LB & 5LB",
    price: "From $79.97",
    wash: "bg-linear-to-br from-amber-300/20 to-neutral-900",
  },
  {
    tag: "Strength",
    name: "EFX Kre-Alkalyn",
    detail: "Buffered creatine · powder & capsules",
    price: "From $39.97",
    wash: "bg-linear-to-br from-orange-400/20 to-neutral-900",
  },
  {
    tag: "Engine",
    name: "TC Nutrition Batch 27",
    detail: "Stim pre-workout · 40 servings",
    price: "$54.97",
    wash: "bg-linear-to-br from-red-500/25 to-neutral-900",
  },
  {
    tag: "Hydration",
    name: "ATPLab Electrolytes XL",
    detail: "150g · training days that run long",
    price: "$42.99",
    wash: "bg-linear-to-br from-emerald-400/20 to-neutral-900",
  },
  {
    tag: "Plant",
    name: "ATPLab Organic Vegan Blend",
    detail: "900g · when whey is off the table",
    price: "$71.99",
    wash: "bg-linear-to-br from-lime-300/20 to-neutral-900",
  },
]

export function ProductCarousel() {
  return (
    <Carousel className="w-full min-w-0" opts={{ align: "start", loop: true }}>
      <CarouselContent className="-ml-4">
        {PRODUCTS.map((product) => (
          <CarouselItem
            key={product.name}
            className="pl-4 sm:basis-1/2 lg:basis-1/3"
          >
            <Card className="h-full border-white/10 bg-card/70">
              <div className={`mx-4 h-36 rounded-2xl ${product.wash}`} />
              <CardHeader>
                <Badge variant="secondary">{product.tag}</Badge>
                <CardTitle className="font-display text-2xl tracking-wide uppercase">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>{product.detail}</p>
                <p className="mt-3 text-foreground">{product.price}</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 z-20 size-9 border-white/20 bg-background/90" />
      <CarouselNext className="right-2 z-20 size-9 border-white/20 bg-background/90" />
      <CarouselDots className="mt-6" />
    </Carousel>
  )
}
