import type { Metadata } from "next"
import { Bebas_Neue, Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
})

export const metadata: Metadata = {
  title: "Carousel Studio · Lift The City",
  description:
    "Build swipeable Instagram carousels and on-site product sliders for Lift The City Supplements.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${bebas.variable} dark h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@400;500;600&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col overflow-x-clip bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  )
}
