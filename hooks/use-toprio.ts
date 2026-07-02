"use client"

import { useCallback, useEffect, useState } from "react"
import {
  type CurrentTask,
  type HistoryEntry,
  type ToprioState,
  createId,
  emptyState,
  loadState,
  saveState,
  STORAGE_KEY,
} from "@/lib/toprio"

export function useToprio() {
  const [state, setState] = useState<ToprioState>(emptyState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadState())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) saveState(state)
  }, [state, hydrated])

  useEffect(() => {
    if (!hydrated) return
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      try {
        const parsed = JSON.parse(e.newValue) as Partial<ToprioState>
        setState({
          current: parsed.current ?? null,
          todos: Array.isArray(parsed.todos) ? parsed.todos : [],
          history: Array.isArray(parsed.history) ? parsed.history : [],
        })
      } catch {
        // ignore parse errors
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [hydrated])

  // Begin working on a brand new task (from start / next-input screen).
  const startTask = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const current: CurrentTask = {
      id: createId(),
      name: trimmed,
      startedAt: Date.now(),
    }
    setState((s) => ({ ...s, current }))
  }, [])

  // Begin working on the next queued to-do (removes it from the queue).
  const startNextTodo = useCallback(() => {
    setState((s) => {
      if (s.todos.length === 0) return s
      const [next, ...rest] = s.todos
      const current: CurrentTask = {
        id: next.id,
        name: next.name,
        startedAt: Date.now(),
      }
      return { ...s, current, todos: rest }
    })
  }, [])

  // Finish the current task, recording it to history.
  const finishCurrent = useCallback(() => {
    setState((s) => {
      if (!s.current) return s
      const endedAt = Date.now()
      const entry: HistoryEntry = {
        id: createId(),
        name: s.current.name,
        startedAt: s.current.startedAt,
        endedAt,
        durationMs: endedAt - s.current.startedAt,
      }
      return { ...s, current: null, history: [entry, ...s.history] }
    })
  }, [])

  const addTodo = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setState((s) => ({
      ...s,
      todos: [...s.todos, { id: createId(), name: trimmed }],
    }))
  }, [])

  const addTodos = useCallback((names: string[]) => {
    const trimmed = names.map((n) => n.trim()).filter(Boolean)
    if (trimmed.length === 0) return
    setState((s) => ({
      ...s,
      todos: [...s.todos, ...trimmed.map((name) => ({ id: createId(), name }))],
    }))
  }, [])

  const removeTodo = useCallback((id: string) => {
    setState((s) => ({ ...s, todos: s.todos.filter((t) => t.id !== id) }))
  }, [])

  const moveTodo = useCallback((id: string, direction: "up" | "down") => {
    setState((s) => {
      const index = s.todos.findIndex((t) => t.id === id)
      if (index === -1) return s
      const target = direction === "up" ? index - 1 : index + 1
      if (target < 0 || target >= s.todos.length) return s
      const todos = [...s.todos]
      const [moved] = todos.splice(index, 1)
      todos.splice(target, 0, moved)
      return { ...s, todos }
    })
  }, [])

  const renameTodo = useCallback((id: string, name: string) => {
    setState((s) => ({
      ...s,
      todos: s.todos.map((t) => (t.id === id ? { ...t, name } : t)),
    }))
  }, [])

  const renameCurrentTask = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setState((s) => (s.current ? { ...s, current: { ...s.current, name: trimmed } } : s))
  }, [])

  const reorderTodos = useCallback((fromIndex: number, toIndex: number) => {
    setState((s) => {
      const todos = [...s.todos]
      const [moved] = todos.splice(fromIndex, 1)
      todos.splice(toIndex, 0, moved)
      return { ...s, todos }
    })
  }, [])

  return {
    state,
    hydrated,
    startTask,
    startNextTodo,
    finishCurrent,
    addTodo,
    addTodos,
    removeTodo,
    moveTodo,
    renameTodo,
    renameCurrentTask,
    reorderTodos,
  }
}
