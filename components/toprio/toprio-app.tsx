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
    renameTodo,
    reorderTodos,
  } = useToprio()

  const [screen, setScreen] = useState<Screen>("start")
  const [historyOrigin, setHistoryOrigin] = useState<Screen>("finished")
  const [finishedVariant, setFinishedVariant] = useState<"finished" | "ready">("finished")

  // On first hydration, resume an in-progress task if one exists.
  useEffect(() => {
    if (!hydrated) return
    if (state.current) {
      setScreen("focus")
    } else if (state.todos.length > 0) {
      setFinishedVariant("ready")
      setScreen("finished")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated])

  useEffect(() => {
    document.title = state.current ? `${state.current.name} - Toprio` : "Toprio"
  }, [state.current])

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
    setFinishedVariant("finished")
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
        variant={finishedVariant}
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
        onReorder={reorderTodos}
        onRename={renameTodo}
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
