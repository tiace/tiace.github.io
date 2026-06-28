"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { type CurrentTask, formatDuration } from "@/lib/toprio"

type FocusScreenProps = {
  task: CurrentTask
  onFinish: () => void
  onCapture: (note: string) => void
}

export function FocusScreen({ task, onFinish, onCapture }: FocusScreenProps) {
  const [now, setNow] = useState(() => Date.now())
  const [note, setNote] = useState("")

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const elapsed = Math.max(0, now - task.startedAt)

  function handleCapture(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = note.trim()
    if (!trimmed) return
    onCapture(trimmed)
    setNote("")
    toast.success(`I'll remind you later: "${trimmed}"`)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-12 px-6 py-16">
      <div
        className="flex w-full max-w-3xl flex-col items-center gap-6 rounded-[2rem] bg-sticky px-8 py-16 text-center shadow-lg sm:px-16 sm:py-20"
        style={{ rotate: "-1deg" }}
      >
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-sticky-foreground/70">
          Now
        </span>
        <h1 className="text-balance text-3xl font-semibold leading-tight text-sticky-foreground sm:text-5xl">
          {task.name}
        </h1>
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
