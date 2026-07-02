"use client"

import { Menu, X } from "lucide-react"

type DrawerButtonProps = {
  open: boolean
  onClick: () => void
}

export function DrawerButton({ open, onClick }: DrawerButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-md transition-transform hover:scale-105 hover:bg-muted/80"
    >
      {open ? (
        <X className="size-5" aria-hidden="true" />
      ) : (
        <Menu className="size-5" aria-hidden="true" />
      )}
    </button>
  )
}
