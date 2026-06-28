"use client"

import { useEffect, useState } from "react"
import { useToprio } from "@/hooks/use-toprio"
import { StartScreen } from "@/components/toprio/start-screen"
import { FocusScreen } from "@/components/toprio/focus-screen"
import { FinishedScreen } from "@/components/toprio/finished-screen"
import { TodoManager } from "@/components/toprio/todo-manager"
import { HistoryScreen } from "@/components/toprio/history-screen"

type Screen = "start" | "focus" | "finished" | "manage" | "history"

export function ToprioApp() {
  const {
    state,
    hydrated,
    startTask,
    startNextTodo,
    finishCurrent,
    addTodo,
    removeTodo,
    moveTodo,
  } = useToprio()

  const [screen, setScreen] = useState<Screen>("start")
  // Where to return to when leaving the history view.
  const [historyOrigin, setHistoryOrigin] = useState<Screen>("finished")

  // On first hydration, resume an in-progress task if one exists.
  useEffect(() => {
    if (!hydrated) return
    setScreen(state.current ? "focus" : "start")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  function handleStartTask(name: string) {
    startTask(name)
    setScreen("focus")
  }

  function handleStartNext() {
    startNextTodo()
    setScreen("focus")
  }

  function handleFinish() {
    finishCurrent()
    setScreen("finished")
  }

  function openHistory(origin: Screen) {
    setHistoryOrigin(origin)
    setScreen("history")
  }

  // Avoid a flash of the wrong screen before localStorage loads.
  if (!hydrated) {
    return <div className="min-h-svh bg-background" aria-hidden="true" />
  }

  if (screen === "focus" && state.current) {
    return (
      <FocusScreen
        task={state.current}
        onFinish={handleFinish}
        onCapture={addTodo}
      />
    )
  }

  if (screen === "finished") {
    return (
      <FinishedScreen
        todos={state.todos}
        onStartNext={handleStartNext}
        onStartNew={handleStartTask}
        onManage={() => setScreen("manage")}
        onHistory={() => openHistory("finished")}
      />
    )
  }

  if (screen === "manage") {
    return (
      <TodoManager
        todos={state.todos}
        onAdd={addTodo}
        onRemove={removeTodo}
        onMove={moveTodo}
        onBack={() => setScreen("finished")}
        onHistory={() => openHistory("manage")}
      />
    )
  }

  if (screen === "history") {
    return (
      <HistoryScreen
        history={state.history}
        onBack={() => setScreen(historyOrigin)}
      />
    )
  }

  return <StartScreen onStart={handleStartTask} />
}
