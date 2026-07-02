"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  type HistoryEntry,
  type HourFormat,
  formatClock,
  formatDateTime,
  formatDurationLong,
} from "@/lib/toprio"

type HistoryScreenProps = {
  history: HistoryEntry[]
  hourFormat?: HourFormat
  onBack: () => void
}

export function HistoryScreen({ history, hourFormat = "24", onBack }: HistoryScreenProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">History</h1>
        <p className="text-sm text-muted-foreground">
          Everything you&apos;ve finished, newest first.
        </p>
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
          Nothing here yet. Finish a task to see it logged.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-medium text-card-foreground">
                  {entry.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(entry.startedAt, hourFormat)} &middot;{" "}
                  {formatClock(entry.startedAt, hourFormat)}
                  {" – "}
                  {formatClock(entry.endedAt, hourFormat)}
                </span>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-3 py-1 font-mono text-xs tabular-nums text-muted-foreground">
                {formatDurationLong(entry.durationMs)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
