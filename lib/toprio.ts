export type Screen = "start" | "focus" | "finished" | "manage" | "history" | "options" | "routines"

export type HourFormat = "12" | "24"

export type Todo = {
  id: string
  name: string
}

export type CurrentTask = {
  id: string
  name: string
  startedAt: number // epoch ms
}

export type HistoryEntry = {
  id: string
  name: string
  startedAt: number // epoch ms
  endedAt: number // epoch ms
  durationMs: number
}

export type ToprioState = {
  current: CurrentTask | null
  todos: Todo[]
  history: HistoryEntry[]
}

export const STORAGE_KEY = "toprio:v1"

export const emptyState: ToprioState = {
  current: null,
  todos: [],
  history: [],
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function loadState(): ToprioState {
  if (typeof window === "undefined") return emptyState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw) as Partial<ToprioState>
    return {
      current: parsed.current ?? null,
      todos: Array.isArray(parsed.todos) ? parsed.todos : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    }
  } catch {
    return emptyState
  }
}

export function saveState(state: ToprioState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota / serialization errors
  }
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}

export function formatClock(epochMs: number, hourFormat: HourFormat = "24"): string {
  return new Date(epochMs).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: hourFormat === "12",
  })
}

export function formatDateTime(epochMs: number, hourFormat: HourFormat = "24"): string {
  return new Date(epochMs).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: hourFormat === "12",
  })
}

export function formatDurationLong(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (hours === 0) parts.push(`${seconds}s`)
  return parts.join(" ")
}
