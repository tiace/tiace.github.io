"use client"

import { type FormEvent, useState } from "react"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowLeft, Clock, GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Todo } from "@/lib/toprio"

type TodoManagerProps = {
  todos: Todo[]
  onAdd: (name: string) => void
  onRemove: (id: string) => void
  onMove: (id: string, direction: "up" | "down") => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onRename: (id: string, name: string) => void
  onBack: () => void
  onHistory: () => void
}

type SortableTodoItemProps = {
  todo: Todo
  index: number
  onRemove: (id: string) => void
  onRename: (id: string, name: string) => void
}

function SortableTodoItem({ todo, index, onRemove, onRename }: SortableTodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id })
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.name)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  function commitEdit() {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== todo.name) onRename(todo.id, trimmed)
    else setEditValue(todo.name)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitEdit()
    if (e.key === "Escape") {
      setEditValue(todo.name)
      setEditing(false)
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex cursor-grab touch-none items-center gap-3 active:cursor-grabbing"
        aria-label={`${todo.name}をドラッグして並び替え`}
      >
        <GripVertical className="size-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {index + 1}
        </span>
      </div>
      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-card-foreground outline-none"
        />
      ) : (
        <span
          className="flex-1 cursor-text truncate text-card-foreground"
          onClick={() => setEditing(true)}
        >
          {todo.name}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 rounded-lg text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(todo.id)}
        aria-label={`${todo.name}を削除`}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>
    </li>
  )
}

export function TodoManager({
  todos,
  onAdd,
  onRemove,
  onReorder,
  onRename,
  onBack,
  onHistory,
}: TodoManagerProps) {
  const [value, setValue] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue("")
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = todos.findIndex((t) => t.id === active.id)
    const toIndex = todos.findIndex((t) => t.id === over.id)
    if (fromIndex !== -1 && toIndex !== -1) {
      onReorder(fromIndex, toIndex)
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-2">
              {todos.map((todo, index) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  onRemove={onRemove}
                  onRename={onRename}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
