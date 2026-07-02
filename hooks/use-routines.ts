"use client"

import { useCallback, useEffect, useState } from "react"
import {
  type Routine,
  type RoutineTask,
  type RoutinesState,
  createRoutineId,
  emptyRoutinesState,
  loadRoutines,
  saveRoutines,
  ROUTINES_STORAGE_KEY,
} from "@/lib/routine"

export function useRoutines() {
  const [state, setState] = useState<RoutinesState>(emptyRoutinesState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadRoutines())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) saveRoutines(state)
  }, [state, hydrated])

  useEffect(() => {
    if (!hydrated) return
    function onStorage(e: StorageEvent) {
      if (e.key !== ROUTINES_STORAGE_KEY || !e.newValue) return
      try {
        const parsed = JSON.parse(e.newValue) as Partial<RoutinesState>
        setState({
          routines: Array.isArray(parsed.routines) ? parsed.routines : [],
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        })
      } catch {}
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [hydrated])

  const createRoutine = useCallback((name: string) => {
    const now = Date.now()
    const routine: Routine = {
      id: createRoutineId(),
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
    }
    setState((s) => ({ ...s, routines: [...s.routines, routine] }))
    return routine.id
  }, [])

  const renameRoutine = useCallback((id: string, name: string) => {
    setState((s) => ({
      ...s,
      routines: s.routines.map((r) =>
        r.id === id ? { ...r, name: name.trim(), updatedAt: Date.now() } : r,
      ),
    }))
  }, [])

  const deleteRoutine = useCallback((id: string) => {
    setState((s) => ({
      routines: s.routines.filter((r) => r.id !== id),
      tasks: s.tasks.filter((t) => t.routineId !== id),
    }))
  }, [])

  const addRoutineTask = useCallback((routineId: string, title: string) => {
    const task: RoutineTask = {
      id: createRoutineId(),
      routineId,
      title: title.trim(),
    }
    setState((s) => ({ ...s, tasks: [...s.tasks, task] }))
  }, [])

  const removeRoutineTask = useCallback((taskId: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }))
  }, [])

  const reorderRoutineTasks = useCallback((routineId: string, fromIndex: number, toIndex: number) => {
    setState((s) => {
      const routineTasks = s.tasks.filter((t) => t.routineId === routineId)
      const otherTasks = s.tasks.filter((t) => t.routineId !== routineId)
      const reordered = [...routineTasks]
      const [moved] = reordered.splice(fromIndex, 1)
      reordered.splice(toIndex, 0, moved)
      return { ...s, tasks: [...otherTasks, ...reordered] }
    })
  }, [])

  const renameRoutineTask = useCallback((taskId: string, title: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, title: title.trim() } : t)),
    }))
  }, [])

  function getTasksForRoutine(routineId: string): RoutineTask[] {
    return state.tasks.filter((t) => t.routineId === routineId)
  }

  return {
    state,
    hydrated,
    createRoutine,
    renameRoutine,
    deleteRoutine,
    addRoutineTask,
    removeRoutineTask,
    reorderRoutineTasks,
    renameRoutineTask,
    getTasksForRoutine,
  }
}
