"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type CurrentTask, formatDuration } from "@/lib/toprio"

type FocusScreenProps = {
  task: CurrentTask
  onFinish: () => void
}

export function FocusScreen({ task, onFinish }: FocusScreenProps) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const elapsed = Math.max(0, now - task.startedAt)

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
    </div>
  )
}
