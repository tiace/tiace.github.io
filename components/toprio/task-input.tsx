"use client"

import { type FormEvent, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type TaskInputProps = {
  onSubmit: (value: string) => void
  placeholder?: string
  submitLabel?: string
  autoFocus?: boolean
}

export function TaskInput({
  onSubmit,
  placeholder = "e.g. Write the project proposal",
  submitLabel = "Start",
  autoFocus = true,
}: TaskInputProps) {
  const [value, setValue] = useState("")

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setValue("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col items-stretch gap-4"
    >
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Task name"
        className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-center text-lg text-card-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
      />
      <Button
        type="submit"
        size="lg"
        disabled={!value.trim()}
        className="h-12 rounded-2xl text-base"
      >
        {submitLabel}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </form>
  )
}
