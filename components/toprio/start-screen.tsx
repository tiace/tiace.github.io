"use client"

import { TaskInput } from "@/components/toprio/task-input"

type StartScreenProps = {
  onStart: (name: string) => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 px-6 py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Toprio
        </span>
        <h1 className="text-balance text-3xl font-semibold text-foreground sm:text-4xl">
          What are you doing right now?
        </h1>
        <p className="max-w-md text-pretty text-muted-foreground">
          One task at a time. Type what you&apos;re working on and stay focused.
        </p>
      </header>
      <TaskInput onSubmit={onStart} />
    </div>
  )
}
