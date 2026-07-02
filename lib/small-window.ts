import { type Screen } from "@/lib/toprio"

export const SMALL_WINDOW_NAME = "toprio-small-window"

export type SmallWindowParams = {
  screen: Screen
  historyOrigin?: Screen
  finishedVariant?: "finished" | "ready"
}

const VALID_SCREENS = new Set<Screen>([
  "start",
  "focus",
  "finished",
  "manage",
  "history",
  "options",
])

export function parseSmallWindowParams(searchParams: URLSearchParams): SmallWindowParams | null {
  const screen = searchParams.get("screen")
  if (!screen || !VALID_SCREENS.has(screen as Screen)) return null
  const historyOrigin = searchParams.get("historyOrigin")
  const finishedVariant = searchParams.get("finishedVariant")
  return {
    screen: screen as Screen,
    historyOrigin:
      historyOrigin && VALID_SCREENS.has(historyOrigin as Screen)
        ? (historyOrigin as Screen)
        : undefined,
    finishedVariant:
      finishedVariant === "finished" || finishedVariant === "ready"
        ? finishedVariant
        : undefined,
  }
}

export function buildSmallWindowUrl(params: SmallWindowParams): string {
  const url = new URL("/small/", window.location.origin)
  url.searchParams.set("screen", params.screen)
  if (params.historyOrigin) {
    url.searchParams.set("historyOrigin", params.historyOrigin)
  }
  if (params.finishedVariant) {
    url.searchParams.set("finishedVariant", params.finishedVariant)
  }
  return url.toString()
}

export function openSmallWindow(params: SmallWindowParams): Window | null {
  const width = 420
  const height = 680
  const left = Math.max(0, window.screenX + window.outerWidth - width - 24)
  const top = Math.max(0, window.screenY + 48)
  const features = [
    "popup=1",
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
    "menubar=no",
    "toolbar=no",
    "location=no",
    "status=no",
    "scrollbars=yes",
    "resizable=yes",
  ].join(",")

  return window.open(buildSmallWindowUrl(params), SMALL_WINDOW_NAME, features)
}
