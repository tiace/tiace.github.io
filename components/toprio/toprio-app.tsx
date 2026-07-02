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
import { RoutinesScreen } from "@/components/toprio/routines-screen"
import { RoutineApplyDialog } from "@/components/toprio/routine-apply-dialog"
import { DrawerButton } from "@/components/toprio/drawer-button"
import { AppDrawer } from "@/components/toprio/app-drawer"
import { openSmallWindow } from "@/lib/small-window"
import { useRoutines } from "@/hooks/use-routines"

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
    addTodos,
    removeTodo,
    moveTodo,
    renameTodo,
    renameCurrentTask,
    reorderTodos,
  } = useToprio()

  const {
    state: routinesState,
    createRoutine,
    renameRoutine,
    deleteRoutine,
    addRoutineTask,
    removeRoutineTask,
    reorderRoutineTasks,
    renameRoutineTask,
    getTasksForRoutine,
  } = useRoutines()
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
  const [routinesOrigin, setRoutinesOrigin] = useState<Screen>("manage")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [finishedVariant, setFinishedVariant] = useState<"finished" | "ready">(
    initialFinishedVariant ?? "finished",
  )
  const [routineDialogOpen, setRoutineDialogOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  function handleApplyRoutine(routineId: string) {
    const tasks = getTasksForRoutine(routineId)
    addTodos(tasks.map((t) => t.title))
    setRoutineDialogOpen(false)
    setToastMessage(`${tasks.length} task${tasks.length !== 1 ? "s" : ""} added`)
  }

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
    if (target === "routines") {
      setRoutinesOrigin(screen)
      setScreen("routines")
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
          onRename={renameCurrentTask}
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
          onRenameNext={renameTodo}
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
          onOpenRoutineDialog={() => setRoutineDialogOpen(true)}
        />
      )
    }

    if (screen === "routines") {
      return (
        <RoutinesScreen
          routines={routinesState.routines}
          getTasksForRoutine={getTasksForRoutine}
          onBack={() => setScreen(routinesOrigin)}
          onCreateRoutine={createRoutine}
          onRenameRoutine={renameRoutine}
          onDeleteRoutine={deleteRoutine}
          onAddRoutineTask={addRoutineTask}
          onRemoveRoutineTask={removeRoutineTask}
          onReorderRoutineTasks={reorderRoutineTasks}
          onRenameRoutineTask={renameRoutineTask}
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
      {routineDialogOpen && (
        <RoutineApplyDialog
          routines={routinesState.routines}
          getTasksForRoutine={getTasksForRoutine}
          onApply={handleApplyRoutine}
          onClose={() => setRoutineDialogOpen(false)}
          onGoToRoutines={() => {
            setRoutineDialogOpen(false)
            setRoutinesOrigin("manage")
            setScreen("routines")
          }}
        />
      )}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg animate-in fade-in duration-200"
        >
          {toastMessage}
        </div>
      )}
    </>
  )
}
