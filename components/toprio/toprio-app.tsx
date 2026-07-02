"use client"

import { useEffect, useState } from "react"
import { useOptions } from "@/hooks/use-options"
import { useToprio } from "@/hooks/use-toprio"
import { type Screen } from "@/lib/toprio"
import { StartScreen } from "@/components/toprio/start-screen"
import { FocusScreen } from "@/components/toprio/focus-screen"
import { FinishedScreen } from "@/components/toprio/finished-screen"
import { TodoManager } from "@/components/toprio/todo-manager"
import { HistoryScreen } from "@/components/toprio/history-screen"
import { OptionsScreen } from "@/components/toprio/options-screen"
import { DrawerButton } from "@/components/toprio/drawer-button"
import { AppDrawer } from "@/components/toprio/app-drawer"
import { openSmallWindow } from "@/lib/small-window"

type ToprioAppProps = {
  initialScreen?: Screen
  initialHistoryOrigin?: Screen
  initialFinishedVariant?: "finished" | "ready"
}

export function ToprioApp({
  initialScreen,
  initialHistoryOrigin,
  initialFinishedVariant,
}: ToprioAppProps = {}) {
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
  const {
    options,
    hydrated: optionsHydrated,
    setDarkMode,
    setNotifications,
    setBackgroundColor,
    setCardColor,
    setHourFormat,
  } = useOptions()

  const [screen, setScreen] = useState<Screen>(initialScreen ?? "start")
  const [historyOrigin, setHistoryOrigin] = useState<Screen>(initialHistoryOrigin ?? "finished")
  const [optionsOrigin, setOptionsOrigin] = useState<Screen>("start")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [finishedVariant, setFinishedVariant] = useState<"finished" | "ready">(
    initialFinishedVariant ?? "finished",
  )

  useEffect(() => {
    if (!hydrated || initialScreen) return
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

  function handleDrawerNavigate(target: Screen) {
    if (target === screen) return
    if (target === "history") {
      // ドロワー経由のHistoryからBackする戻り先を決定
      const origin: Screen = state.current ? "focus" : "finished"
      setHistoryOrigin(origin)
      setScreen("history")
      return
    }
    if (target === "options") {
      setOptionsOrigin(screen)
      setScreen("options")
      return
    }
    setScreen(target)
  }

  if (!hydrated || !optionsHydrated) {
    return <div className="min-h-svh bg-background" aria-hidden="true" />
  }

  function renderScreen() {
    if (screen === "focus" && state.current) {
      return (
        <FocusScreen
          task={state.current}
          onFinish={handleFinish}
          onCapture={addTodo}
          notificationsEnabled={options.notifications}
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
          onBack={() => setScreen(state.current ? "focus" : "finished")}
          onHistory={() => openHistory("manage")}
        />
      )
    }

    if (screen === "history") {
      return (
        <HistoryScreen
          history={state.history}
          hourFormat={options.hourFormat}
          onBack={() => setScreen(historyOrigin)}
        />
      )
    }

    if (screen === "options") {
      return (
        <OptionsScreen
          options={options}
          onBack={() => setScreen(optionsOrigin)}
          onDarkModeChange={setDarkMode}
          onNotificationsChange={setNotifications}
          onBackgroundColorChange={setBackgroundColor}
          onCardColorChange={setCardColor}
          onHourFormatChange={setHourFormat}
        />
      )
    }

    return <StartScreen onStart={handleStartTask} />
  }

  function handleOpenSmallWindow() {
    openSmallWindow({ screen, historyOrigin, finishedVariant })
    setDrawerOpen(false)
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
        onOpenSmallWindow={handleOpenSmallWindow}
      />
    </>
  )
}
