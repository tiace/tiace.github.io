"use client"

import { useEffect, useState } from "react"
import { Clock, ListChecks, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type CurrentTask, type Screen, formatDuration } from "@/lib/toprio"

type AppDrawerProps = {
  open: boolean
  screen: Screen
  current: CurrentTask | null
  onClose: () => void
  onNavigate: (screen: Screen) => void
}

type NavItem = {
  screen: Screen
  label: string
  icon: React.ReactNode
  disabled?: boolean
}

function CurrentTaskCard({ task }: { task: CurrentTask }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl bg-sticky px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-sticky-foreground/70">
        Now
      </span>
      <p className="mt-1 truncate font-medium text-sticky-foreground">{task.name}</p>
      <p className="font-mono text-sm tabular-nums text-sticky-foreground/80">
        {formatDuration(Math.max(0, now - task.startedAt))}
      </p>
    </div>
  )
}

export function AppDrawer({ open, screen, current, onClose, onNavigate }: AppDrawerProps) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  const navItems: NavItem[] = [
    {
      screen: "focus",
      label: "Focus",
      icon: <Play className="size-4" aria-hidden="true" />,
      disabled: !current,
    },
    { screen: "manage", label: "To-dos", icon: <ListChecks className="size-4" aria-hidden="true" /> },
    { screen: "history", label: "History", icon: <Clock className="size-4" aria-hidden="true" /> },
  ]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* バックドロップ */}
      <div
        className="absolute inset-0 bg-black/30 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ドロワーパネル */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
        className="relative flex h-full w-72 max-w-[80vw] flex-col border-l border-border bg-card shadow-xl animate-in slide-in-from-right duration-200"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Toprio
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="メニューを閉じる"
            className="size-8 rounded-lg"
            autoFocus
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex flex-col gap-4 px-3 pb-6">
          {/* 実行中タスク（focus画面中のみ） */}
          {screen === "focus" && current && <CurrentTaskCard task={current} />}

          {/* ナビゲーション */}
          <nav>
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.screen}>
                  <button
                    onClick={() => {
                      onNavigate(item.screen)
                      onClose()
                    }}
                    disabled={item.disabled}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      "disabled:pointer-events-none disabled:opacity-40",
                      screen === item.screen
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    ].join(" ")}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
