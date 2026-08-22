import type { ReactNode } from "react"
import { SLIDE_THEMES, type CarouselSlide } from "@/lib/carousel-state"
import { cn } from "@/lib/utils"

const SLIDE_SIZE = 1080

export function InstagramSlideCanvas({
  slide,
  index,
  total,
  className,
}: {
  slide: CarouselSlide
  index: number
  total: number
  className?: string
}) {
  const theme = SLIDE_THEMES[slide.theme]
  const number = String(index + 1).padStart(2, "0")

  return (
    <article
      className={cn("relative overflow-hidden text-left", className)}
      style={{
        width: SLIDE_SIZE,
        height: SLIDE_SIZE,
        background: theme.background,
        color: theme.title,
      }}
      data-slide-id={slide.id}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-16 font-display leading-none"
        style={{
          color: theme.stamp,
          fontSize: 420,
          letterSpacing: -12,
        }}
      >
        {number}
      </div>

      <div className="relative flex h-full flex-col justify-between p-20">
        <header className="flex items-start justify-between gap-8">
          <p
            className="font-display text-[34px] tracking-[0.28em] uppercase"
            style={{ color: theme.eyebrow }}
          >
            {slide.eyebrow}
          </p>
          <p
            className="font-display text-[28px] tracking-[0.22em] uppercase"
            style={{ color: theme.footer }}
          >
            {number} / {String(total).padStart(2, "0")}
          </p>
        </header>

        <div className="max-w-[860px]">
          <h2
            className="font-display text-[92px] leading-[0.9] tracking-tight uppercase"
            style={{ color: theme.title }}
          >
            {slide.title}
          </h2>
          <div
            className="mt-10 h-1.5 w-28"
            style={{ background: theme.rule }}
          />
          <p
            className="mt-10 max-w-[720px] text-[32px] leading-snug"
            style={{ color: theme.body }}
          >
            {slide.body}
          </p>
        </div>

        <footer
          className="flex items-end justify-between font-display text-[28px] tracking-[0.2em] uppercase"
          style={{ color: theme.footer }}
        >
          <span>{slide.footer}</span>
          <span>Lift The City</span>
        </footer>
      </div>
    </article>
  )
}

export function ScaledSlide({
  size = 360,
  className,
  children,
}: {
  size?: number
  className?: string
  children: ReactNode
}) {
  const scale = size / SLIDE_SIZE

  return (
    <div
      className={cn("relative overflow-hidden rounded-[28px] shadow-2xl", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="origin-top-left"
        style={{
          width: SLIDE_SIZE,
          height: SLIDE_SIZE,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
