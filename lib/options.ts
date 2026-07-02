export type HourFormat = "12" | "24"

export type ColorSwatch = {
  id: string
  label: string
  value: string
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
  { id: "cream", label: "Cream", value: "#F7F5F2" },
  { id: "white", label: "White", value: "#FFFFFF" },
  { id: "mist", label: "Mist", value: "#F0F4FF" },
  { id: "sage", label: "Sage", value: "#F0FFF4" },
  { id: "peach", label: "Peach", value: "#FFF5F0" },
  { id: "lavender", label: "Lavender", value: "#F5F0FF" },
  { id: "aqua", label: "Aqua", value: "#F0FAFA" },
  { id: "sand", label: "Sand", value: "#FFF8E7" },
]

export const CARD_COLORS: ColorSwatch[] = [
  { id: "butter", label: "Butter", value: "#FFF8D8" },
  { id: "snow", label: "Snow", value: "#FFFFFF" },
  { id: "sky", label: "Sky", value: "#E8EDFF" },
  { id: "mint", label: "Mint", value: "#E8F5E9" },
  { id: "coral", label: "Coral", value: "#FFE8E0" },
  { id: "lilac", label: "Lilac", value: "#EDE7F6" },
  { id: "teal", label: "Teal", value: "#E0F7FA" },
  { id: "amber", label: "Amber", value: "#FFF3E0" },
]

export const defaultOptions: OptionsState = {
  darkMode: false,
  notifications: true,
  backgroundColor: BACKGROUND_COLORS[0].id,
  cardColor: CARD_COLORS[0].id,
  hourFormat: "24",
}

function findColorValue(palette: ColorSwatch[], id: string): string | undefined {
  return palette.find((color) => color.id === id)?.value
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
        findColorValue(BACKGROUND_COLORS, parsed.backgroundColor ?? "")
          ? (parsed.backgroundColor as string)
          : defaultOptions.backgroundColor,
      cardColor:
        findColorValue(CARD_COLORS, parsed.cardColor ?? "")
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
    root.style.removeProperty("--background")
    root.style.removeProperty("--sidebar")
    root.style.removeProperty("--card")
    root.style.removeProperty("--sticky")
    root.style.removeProperty("--popover")
  } else {
    root.classList.remove("dark")
    root.classList.add("light")

    const background = findColorValue(BACKGROUND_COLORS, options.backgroundColor)
    const card = findColorValue(CARD_COLORS, options.cardColor)

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
  }

  const themeColor = options.darkMode ? "#1C1C1C" : (findColorValue(BACKGROUND_COLORS, options.backgroundColor) ?? "#F7F5F2")
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute("content", themeColor)
}
