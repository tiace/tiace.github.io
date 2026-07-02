export type Routine = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

export type RoutineTask = {
  id: string
  routineId: string
  title: string
}

export type RoutinesState = {
  routines: Routine[]
  tasks: RoutineTask[]
}

export function createRoutineId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const ROUTINES_STORAGE_KEY = "toprio:routines:v1"

export const emptyRoutinesState: RoutinesState = {
  routines: [],
  tasks: [],
}

export function loadRoutines(): RoutinesState {
  if (typeof window === "undefined") return emptyRoutinesState
  try {
    const raw = window.localStorage.getItem(ROUTINES_STORAGE_KEY)
    if (!raw) return emptyRoutinesState
    const parsed = JSON.parse(raw) as Partial<RoutinesState>
    return {
      routines: Array.isArray(parsed.routines) ? parsed.routines : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
    }
  } catch {
    return emptyRoutinesState
  }
}

export function saveRoutines(state: RoutinesState): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(ROUTINES_STORAGE_KEY, JSON.stringify(state))
  } catch {}
}
