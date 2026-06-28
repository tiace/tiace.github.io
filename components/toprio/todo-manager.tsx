"use client"

import { type FormEvent, useState } from "react"
import { ArrowLeft, ChevronDown, ChevronUp, Clock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Todo } from "@/lib/toprio"

type TodoManagerProps = {
  todos: Todo[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onMove: (id: string, direction: "up" | "down") => void
  onBack: () => void
  onHistory: () => void
}

export function TodoManager({
  todos,
  onAdd,
  onRemove,
  onMove,
  onBack,
  onHistory,
}: TodoManagerProps) {
  const [value, setValue] = useState("")

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue("")
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Done
        </Button>
        <Button variant="ghost" size="sm" onClick={onHistory} className="rounded-xl">
          <Clock className="size-4" aria-hidden="true" />
          History
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">To-dos</h1>
        <p className="text-sm text-muted-foreground">
          These stay hidden while you work. The top item is started next.
        </p>
      </div>

      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a task"
          aria-label="New task name"
          className="h-11 w-full rounded-xl border border-border bg-card px-4 text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
        <Button type="submit" disabled={!value.trim()} className="h-11 rounded-xl">
          <Plus className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Add</span>
        </Button>
      </form>

      {todos.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
          No upcoming tasks yet. Add one above.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo, index) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
              <span className="flex-1 truncate text-card-foreground">
                {todo.name}
              </span>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg"
                  disabled={index === 0}
                  onClick={() => onMove(todo.id, "up")}
                  aria-label={`Move ${todo.name} up`}
                >
                  <ChevronUp className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg"
                  disabled={index === todos.length - 1}
                  onClick={() => onMove(todo.id, "down")}
                  aria-label={`Move ${todo.name} down`}
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(todo.id)}
                  aria-label={`Delete ${todo.name}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
