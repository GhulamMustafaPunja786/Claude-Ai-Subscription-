import { toPng } from "html-to-image"
import JSZip from "jszip"
import { slideFilename } from "@/lib/carousel-state"

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function elementToPngBlob(element: HTMLElement): Promise<Blob> {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 1,
    width: 1080,
    height: 1080,
  })
  const response = await fetch(dataUrl)
  return response.blob()
}

export async function downloadSlidePng(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const blob = await elementToPngBlob(element)
  downloadBlob(blob, filename)
}

export async function downloadDeckZip(
  slides: Array<{ element: HTMLElement; filename: string }>,
  zipName: string
): Promise<void> {
  const zip = new JSZip()

  for (const slide of slides) {
    const blob = await elementToPngBlob(slide.element)
    zip.file(slide.filename, blob)
  }

  const archive = await zip.generateAsync({ type: "blob" })
  downloadBlob(archive, zipName)
}

export { slideFilename }
