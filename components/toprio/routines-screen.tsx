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
import { ArrowLeft, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Routine, RoutineTask } from "@/lib/routine"

// ルーティン内タスクのソート可能アイテム
type SortableRoutineTaskItemProps = {
  task: RoutineTask
  onRemove: (id: string) => void
  onRename: (id: string, title: string) => void
}

function SortableRoutineTaskItem({ task, onRemove, onRename }: SortableRoutineTaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  function commitEdit() {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== task.title) onRename(task.id, trimmed)
    else setEditValue(task.title)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitEdit()
    if (e.key === "Escape") {
      setEditValue(task.title)
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
        className="flex cursor-grab touch-none items-center active:cursor-grabbing"
        aria-label={`Drag to reorder ${task.title}`}
      >
        <GripVertical className="size-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
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
          {task.title}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 rounded-lg text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(task.id)}
        aria-label={`Remove ${task.title}`}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>
    </li>
  )
}

// ルーティン詳細・編集画面
type RoutineDetailProps = {
  routine: Routine
  tasks: RoutineTask[]
  onBack: () => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onAddTask: (routineId: string, title: string) => void
  onRemoveTask: (taskId: string) => void
  onReorderTasks: (routineId: string, fromIndex: number, toIndex: number) => void
  onRenameTask: (taskId: string, title: string) => void
}

function RoutineDetail({
  routine,
  tasks,
  onBack,
  onRename,
  onDelete,
  onAddTask,
  onRemoveTask,
  onReorderTasks,
  onRenameTask,
}: RoutineDetailProps) {
  const [taskValue, setTaskValue] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(routine.name)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleAddTask(e: FormEvent) {
    e.preventDefault()
    const trimmed = taskValue.trim()
    if (!trimmed) return
    onAddTask(routine.id, trimmed)
    setTaskValue("")
  }

  function commitNameEdit() {
    const trimmed = nameValue.trim()
    if (trimmed && trimmed !== routine.name) onRename(routine.id, trimmed)
    else setNameValue(routine.name)
    setEditingName(false)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = tasks.findIndex((t) => t.id === active.id)
    const toIndex = tasks.findIndex((t) => t.id === over.id)
    if (fromIndex !== -1 && toIndex !== -1) onReorderTasks(routine.id, fromIndex, toIndex)
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (!window.confirm(`Delete "${routine.name}"? This cannot be undone.`)) return
            onDelete(routine.id)
          }}
          className="rounded-xl text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </Button>
      </div>

      <div>
        {editingName ? (
          <input
            autoFocus
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitNameEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitNameEdit()
              if (e.key === "Escape") {
                setNameValue(routine.name)
                setEditingName(false)
              }
            }}
            className="w-full bg-transparent text-2xl font-semibold text-foreground outline-none"
          />
        ) : (
          <h1
            className="cursor-text text-2xl font-semibold text-foreground"
            onClick={() => setEditingName(true)}
          >
            {routine.name}
          </h1>
        )}
      </div>

      <form onSubmit={handleAddTask} className="flex items-center gap-2">
        <input
          value={taskValue}
          onChange={(e) => setTaskValue(e.target.value)}
          placeholder="Add a task"
          aria-label="New task name"
          className="h-11 w-full rounded-xl border border-border bg-card px-4 text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
        <Button type="submit" disabled={!taskValue.trim()} className="h-11 rounded-xl">
          <Plus className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Add</span>
        </Button>
      </form>

      {tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
          No tasks yet. Add one above.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-2">
              {tasks.map((task) => (
                <SortableRoutineTaskItem
                  key={task.id}
                  task={task}
                  onRemove={onRemoveTask}
                  onRename={onRenameTask}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

// ルーティン一覧画面
type RoutinesScreenProps = {
  routines: Routine[]
  getTasksForRoutine: (routineId: string) => RoutineTask[]
  onBack: () => void
  onCreateRoutine: (name: string) => string
  onRenameRoutine: (id: string, name: string) => void
  onDeleteRoutine: (id: string) => void
  onAddRoutineTask: (routineId: string, title: string) => void
  onRemoveRoutineTask: (taskId: string) => void
  onReorderRoutineTasks: (routineId: string, fromIndex: number, toIndex: number) => void
  onRenameRoutineTask: (taskId: string, title: string) => void
}

export function RoutinesScreen({
  routines,
  getTasksForRoutine,
  onBack,
  onCreateRoutine,
  onRenameRoutine,
  onDeleteRoutine,
  onAddRoutineTask,
  onRemoveRoutineTask,
  onReorderRoutineTasks,
  onRenameRoutineTask,
}: RoutinesScreenProps) {
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null)
  const [newRoutineName, setNewRoutineName] = useState("")

  const selectedRoutine = routines.find((r) => r.id === selectedRoutineId) ?? null

  function handleCreate(e: FormEvent) {
    e.preventDefault()
    const trimmed = newRoutineName.trim()
    if (!trimmed) return
    const id = onCreateRoutine(trimmed)
    setNewRoutineName("")
    setSelectedRoutineId(id)
  }

  function handleDelete(id: string) {
    onDeleteRoutine(id)
    setSelectedRoutineId(null)
  }

  if (selectedRoutine) {
    return (
      <RoutineDetail
        routine={selectedRoutine}
        tasks={getTasksForRoutine(selectedRoutine.id)}
        onBack={() => setSelectedRoutineId(null)}
        onRename={onRenameRoutine}
        onDelete={handleDelete}
        onAddTask={onAddRoutineTask}
        onRemoveTask={onRemoveRoutineTask}
        onReorderTasks={onReorderRoutineTasks}
        onRenameTask={onRenameRoutineTask}
      />
    )
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Done
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Routines</h1>
        <p className="text-sm text-muted-foreground">
          Save your frequently used task sets and add them in one tap.
        </p>
      </div>

      {routines.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
          No routines yet. Create one below.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {routines.map((routine) => {
            const tasks = getTasksForRoutine(routine.id)
            return (
              <li key={routine.id}>
                <button
                  onClick={() => setSelectedRoutineId(routine.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium text-card-foreground">{routine.name}</span>
                    <span className="text-xs text-muted-foreground">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <form onSubmit={handleCreate} className="flex items-center gap-2">
        <input
          value={newRoutineName}
          onChange={(e) => setNewRoutineName(e.target.value)}
          placeholder="New routine name"
          aria-label="New routine name"
          className="h-11 w-full rounded-xl border border-border bg-card px-4 text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
        <Button type="submit" disabled={!newRoutineName.trim()} className="h-11 rounded-xl">
          <Plus className="size-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Create</span>
        </Button>
      </form>
    </div>
  )
}
