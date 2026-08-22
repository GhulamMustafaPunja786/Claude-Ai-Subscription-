import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader({ active }: { active?: "home" | "studio" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-amber-400 text-sm font-bold text-black">
            LTC
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg tracking-[0.18em] uppercase">
              Carousel Studio
            </span>
            <span className="block text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
              Lift The City
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant={active === "home" ? "secondary" : "ghost"}>
            <Link href="/">Gallery</Link>
          </Button>
          <Button asChild variant={active === "studio" ? "default" : "secondary"}>
            <Link href="/studio">Make carousels</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Carousel Studio for Instagram-ready Lift The City decks.</p>
        <p>50 Fort York Blvd · Toronto</p>
      </div>
    </footer>
  )
}
