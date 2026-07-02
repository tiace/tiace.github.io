"use client"

import { useRef, useState } from "react"
import { ArrowRight, Clock, ListChecks, PartyPopper, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskInput } from "@/components/toprio/task-input"
import type { Todo } from "@/lib/toprio"

type FinishedScreenProps = {
  todos: Todo[]
  onStartNext: () => void
  onStartNew: (name: string) => void
  onManage: () => void
  onHistory: () => void
  onRenameNext: (id: string, name: string) => void
  variant?: "finished" | "ready"
}

export function FinishedScreen({
  todos,
  onStartNext,
  onStartNew,
  onManage,
  onHistory,
  onRenameNext,
  variant = "finished",
}: FinishedScreenProps) {
  const next = todos[0]
  const isReady = variant === "ready"
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function startEditing() {
    if (!next) return
    setEditValue(next.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commitEdit() {
    if (!next) return
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== next.name) onRenameNext(next.id, trimmed)
    else setEditValue(next.name)
    setEditing(false)
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitEdit()
    if (e.key === "Escape") {
      setEditing(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 px-6 py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-sticky text-sticky-foreground">
          {isReady
            ? <Play className="size-6" aria-hidden="true" />
            : <PartyPopper className="size-6" aria-hidden="true" />
          }
        </span>
        <h1 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
          {isReady ? "What's next?" : "Task complete"}
        </h1>
        <p className="text-muted-foreground">
          {next
            ? "Here's what's next."
            : isReady
              ? "What would you like to do?"
              : "What would you like to do next?"
          }
        </p>
      </header>

      {next ? (
        <div className="flex w-full max-w-xl flex-col items-stretch gap-4">
          <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card px-5 py-4 text-center">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Next up
            </span>
            {editing ? (
              <input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={handleEditKeyDown}
                className="w-full break-words bg-transparent text-center text-lg font-medium text-card-foreground outline-none"
              />
            ) : (
              <span
                className="cursor-text break-words text-lg font-medium text-card-foreground"
                onClick={startEditing}
              >
                {next.name}
              </span>
            )}
          </div>
          <Button
            onClick={onStartNext}
            size="lg"
            className="h-12 rounded-2xl text-base"
          >
            Start
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <TaskInput onSubmit={onStartNew} placeholder="What's next?" />
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="ghost" onClick={onManage} className="rounded-xl">
          <ListChecks className="size-4" aria-hidden="true" />
          Manage to-dos
          {todos.length > 0 ? (
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {todos.length}
            </span>
          ) : null}
        </Button>
        <Button variant="ghost" onClick={onHistory} className="rounded-xl">
          <Clock className="size-4" aria-hidden="true" />
          History
        </Button>
      </div>
    </div>
  )
}
