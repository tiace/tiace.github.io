"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Routine, RoutineTask } from "@/lib/routine"

type RoutineApplyDialogProps = {
  routines: Routine[]
  getTasksForRoutine: (routineId: string) => RoutineTask[]
  onApply: (routineId: string) => void
  onClose: () => void
}

export function RoutineApplyDialog({
  routines,
  getTasksForRoutine,
  onApply,
  onClose,
}: RoutineApplyDialogProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/30 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Select a routine"
        className="relative w-full max-w-sm rounded-t-2xl border border-border bg-card shadow-xl animate-in slide-in-from-bottom duration-200 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-sm font-semibold text-foreground">Add a routine</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
            className="size-8 rounded-lg"
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {routines.length === 0 ? (
          <p className="px-4 pb-8 text-sm text-muted-foreground">
            No routines yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-1 px-2 pb-4">
            {routines.map((routine) => {
              const tasks = getTasksForRoutine(routine.id)
              return (
                <li key={routine.id}>
                  <button
                    onClick={() => onApply(routine.id)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <span className="text-sm font-medium text-foreground">{routine.name}</span>
                    <span className="text-xs text-muted-foreground">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
