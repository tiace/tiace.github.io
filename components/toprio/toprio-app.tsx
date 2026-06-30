"use client"

import { useEffect, useState } from "react"
import { useToprio } from "@/hooks/use-toprio"
import { type Screen } from "@/lib/toprio"
import { StartScreen } from "@/components/toprio/start-screen"
import { FocusScreen } from "@/components/toprio/focus-screen"
import { FinishedScreen } from "@/components/toprio/finished-screen"
import { TodoManager } from "@/components/toprio/todo-manager"
import { HistoryScreen } from "@/components/toprio/history-screen"
import { DrawerButton } from "@/components/toprio/drawer-button"
import { AppDrawer } from "@/components/toprio/app-drawer"

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
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    setScreen(state.current ? "focus" : "start")
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
    setScreen("finished")
  }

  function openHistory(origin: Screen) {
    setHistoryOrigin(origin)
    setScreen("history")
  }

  function handleDrawerNavigate(target: Screen) {
    if (target === screen) return
    if (target === "history") {
      // ドロワー経由のHistoryからBackする戻り先を決定
      const origin: Screen = state.current ? "focus" : "finished"
      setHistoryOrigin(origin)
      setScreen("history")
      return
    }
    setScreen(target)
  }

  if (!hydrated) {
    return <div className="min-h-svh bg-background" aria-hidden="true" />
  }

  function renderScreen() {
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

  return (
    <>
      {renderScreen()}
      <DrawerButton open={drawerOpen} onClick={() => setDrawerOpen((v) => !v)} />
      <AppDrawer
        open={drawerOpen}
        screen={screen}
        current={state.current}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
      />
    </>
  )
}
