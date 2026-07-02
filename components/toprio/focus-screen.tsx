"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { type CurrentTask, formatDuration } from "@/lib/toprio"

type FocusScreenProps = {
  task: CurrentTask
  onFinish: () => void
  onCapture: (note: string) => void
  onRename: (name: string) => void
  notificationsEnabled?: boolean
}

export function FocusScreen({
  task,
  onFinish,
  onCapture,
  onRename,
  notificationsEnabled = true,
}: FocusScreenProps) {
  const [now, setNow] = useState(() => Date.now())
  const [note, setNote] = useState("")
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const elapsed = Math.max(0, now - task.startedAt)

  function startEditing() {
    setEditValue(task.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commitEdit() {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== task.name) onRename(trimmed)
    else setEditValue(task.name)
    setEditing(false)
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitEdit()
    if (e.key === "Escape") {
      setEditValue(task.name)
      setEditing(false)
    }
  }

  function handleCapture(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = note.trim()
    if (!trimmed) return
    onCapture(trimmed)
    setNote("")
    if (notificationsEnabled) {
      toast.success(`I'll remind you later: "${trimmed}"`)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-12 px-6 py-16">
      <div
        className="flex w-full max-w-lg flex-col items-center gap-6 rounded-[2rem] bg-sticky px-8 py-12 text-center shadow-lg sm:px-16 sm:py-16"
        style={{ rotate: "-1deg" }}
      >
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-sticky-foreground/70">
          Now
        </span>
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleEditKeyDown}
            className="w-full bg-transparent text-center text-3xl font-semibold leading-tight text-sticky-foreground outline-none sm:text-5xl"
          />
        ) : (
          <h1
            className="text-balance text-3xl font-semibold leading-tight text-sticky-foreground sm:text-5xl cursor-text"
            onClick={startEditing}
          >
            {task.name}
          </h1>
        )}
        <p
          className="font-mono text-2xl tabular-nums text-sticky-foreground/80 sm:text-3xl"
          aria-label="Elapsed time"
        >
          {formatDuration(elapsed)}
        </p>
      </div>

      <Button
        onClick={onFinish}
        size="lg"
        className="h-14 rounded-2xl px-10 text-base"
      >
        <Check className="size-5" aria-hidden="true" />
        Finished
      </Button>

      <form onSubmit={handleCapture} className="w-full max-w-md">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Need to remember something?"
          aria-label="Capture a thought to remember later"
          className="w-full rounded-2xl border border-border bg-card/60 px-5 py-3 text-center text-sm text-card-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:ring-2 focus:ring-ring/40"
        />
      </form>
    </div>
  )
}
