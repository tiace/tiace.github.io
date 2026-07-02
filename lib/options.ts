export type HourFormat = "12" | "24"

export type ColorSwatch = {
  id: string
  label: string
  light: string
  dark: string
}

export type OptionsState = {
  darkMode: boolean
  notifications: boolean
  backgroundColor: string
  cardColor: string
  hourFormat: HourFormat
}

export const OPTIONS_STORAGE_KEY = "toprio:options:v1"

export const BACKGROUND_COLORS: ColorSwatch[] = [
  { id: "cream", label: "Cream", light: "#F7F5F2", dark: "#1C1B19" },
  { id: "white", label: "White", light: "#FFFFFF", dark: "#1A1A1A" },
  { id: "mist", label: "Mist", light: "#F0F4FF", dark: "#181B22" },
  { id: "sage", label: "Sage", light: "#F0FFF4", dark: "#181F1B" },
  { id: "peach", label: "Peach", light: "#FFF5F0", dark: "#211C1A" },
  { id: "lavender", label: "Lavender", light: "#F5F0FF", dark: "#1C1922" },
  { id: "aqua", label: "Aqua", light: "#F0FAFA", dark: "#181F1F" },
  { id: "sand", label: "Sand", light: "#FFF8E7", dark: "#1F1C17" },
]

export const CARD_COLORS: ColorSwatch[] = [
  { id: "butter", label: "Butter", light: "#FFF8D8", dark: "#2A2820" },
  { id: "snow", label: "Snow", light: "#FFFFFF", dark: "#282828" },
  { id: "sky", label: "Sky", light: "#E8EDFF", dark: "#222530" },
  { id: "mint", label: "Mint", light: "#E8F5E9", dark: "#222A24" },
  { id: "coral", label: "Coral", light: "#FFE8E0", dark: "#2A2320" },
  { id: "lilac", label: "Lilac", light: "#EDE7F6", dark: "#262228" },
  { id: "teal", label: "Teal", light: "#E0F7FA", dark: "#1F2828" },
  { id: "amber", label: "Amber", light: "#FFF3E0", dark: "#2A261F" },
]

export const defaultOptions: OptionsState = {
  darkMode: false,
  notifications: true,
  backgroundColor: BACKGROUND_COLORS[0].id,
  cardColor: CARD_COLORS[0].id,
  hourFormat: "24",
}

function findColorSwatch(palette: ColorSwatch[], id: string): ColorSwatch | undefined {
  return palette.find((color) => color.id === id)
}

export function getColorValue(
  palette: ColorSwatch[],
  id: string,
  darkMode: boolean,
): string | undefined {
  const swatch = findColorSwatch(palette, id)
  if (!swatch) return undefined
  return darkMode ? swatch.dark : swatch.light
}

export function loadOptions(): OptionsState {
  if (typeof window === "undefined") return defaultOptions
  try {
    const raw = window.localStorage.getItem(OPTIONS_STORAGE_KEY)
    if (!raw) return defaultOptions
    const parsed = JSON.parse(raw) as Partial<OptionsState>
    return {
      darkMode: parsed.darkMode ?? defaultOptions.darkMode,
      notifications: parsed.notifications ?? defaultOptions.notifications,
      backgroundColor:
        findColorSwatch(BACKGROUND_COLORS, parsed.backgroundColor ?? "")
          ? (parsed.backgroundColor as string)
          : defaultOptions.backgroundColor,
      cardColor:
        findColorSwatch(CARD_COLORS, parsed.cardColor ?? "")
          ? (parsed.cardColor as string)
          : defaultOptions.cardColor,
      hourFormat: parsed.hourFormat === "12" ? "12" : "24",
    }
  } catch {
    return defaultOptions
  }
}

export function saveOptions(options: OptionsState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
  } catch {
    // ignore quota / serialization errors
  }
}

export function applyOptions(options: OptionsState): void {
  if (typeof document === "undefined") return

  const root = document.documentElement

  if (options.darkMode) {
    root.classList.remove("light")
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
    root.classList.add("light")
  }

  const background = getColorValue(BACKGROUND_COLORS, options.backgroundColor, options.darkMode)
  const card = getColorValue(CARD_COLORS, options.cardColor, options.darkMode)

  if (background) {
    root.style.setProperty("--background", background)
    root.style.setProperty("--sidebar", background)
  } else {
    root.style.removeProperty("--background")
    root.style.removeProperty("--sidebar")
  }

  if (card) {
    root.style.setProperty("--card", card)
    root.style.setProperty("--sticky", card)
    root.style.setProperty("--popover", card)
  } else {
    root.style.removeProperty("--card")
    root.style.removeProperty("--sticky")
    root.style.removeProperty("--popover")
  }

  const themeColor =
    background ??
    getColorValue(BACKGROUND_COLORS, defaultOptions.backgroundColor, options.darkMode) ??
    "#F7F5F2"
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute("content", themeColor)
}
