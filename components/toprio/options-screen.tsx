"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  BACKGROUND_COLORS,
  CARD_COLORS,
  type HourFormat,
  type OptionsState,
} from "@/lib/options"

type OptionsScreenProps = {
  options: OptionsState
  onBack: () => void
  onDarkModeChange: (value: boolean) => void
  onNotificationsChange: (value: boolean) => void
  onBackgroundColorChange: (id: string) => void
  onCardColorChange: (id: string) => void
  onHourFormatChange: (value: HourFormat) => void
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium text-card-foreground">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  )
}

function ColorSwatches({
  colors,
  selectedId,
  onSelect,
  groupLabel,
}: {
  colors: typeof BACKGROUND_COLORS
  selectedId: string
  onSelect: (id: string) => void
  groupLabel: string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => {
        const selected = color.id === selectedId
        return (
          <button
            key={color.id}
            type="button"
            aria-label={`${groupLabel}: ${color.label}`}
            aria-pressed={selected}
            title={color.label}
            onClick={() => onSelect(color.id)}
            className={[
              "size-9 rounded-full border-2 transition-transform hover:scale-105",
              selected ? "border-primary ring-2 ring-primary/30" : "border-border",
            ].join(" ")}
            style={{ backgroundColor: color.value }}
          />
        )
      })}
    </div>
  )
}

function HourFormatPicker({
  value,
  onChange,
}: {
  value: HourFormat
  onChange: (value: HourFormat) => void
}) {
  const choices: { value: HourFormat; label: string }[] = [
    { value: "12", label: "12-hour" },
    { value: "24", label: "24-hour" },
  ]

  return (
    <div className="inline-flex rounded-xl bg-muted p-1">
      {choices.map((choice) => (
        <button
          key={choice.value}
          type="button"
          onClick={() => onChange(choice.value)}
          aria-pressed={value === choice.value}
          className={[
            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            value === choice.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}

export function OptionsScreen({
  options,
  onBack,
  onDarkModeChange,
  onNotificationsChange,
  onBackgroundColorChange,
  onCardColorChange,
  onHourFormatChange,
}: OptionsScreenProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Options</h1>
        <p className="text-sm text-muted-foreground">Customize how Toprio looks and behaves.</p>
      </div>

      <div className="flex flex-col gap-3">
        <SettingRow label="Dark mode" description="Use a darker color scheme.">
          <ToggleSwitch
            checked={options.darkMode}
            onChange={onDarkModeChange}
            label="Dark mode"
          />
        </SettingRow>

        <SettingRow
          label="Notifications"
          description="Show reminders when you capture a thought."
        >
          <ToggleSwitch
            checked={options.notifications}
            onChange={onNotificationsChange}
            label="Notifications"
          />
        </SettingRow>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Color</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {options.darkMode
              ? "Color options apply in light mode."
              : "Pick background and card colors."}
          </p>
        </div>

        <div
          className={[
            "flex flex-col gap-4 rounded-xl border border-border bg-card px-4 py-4",
            options.darkMode ? "opacity-50" : "",
          ].join(" ")}
        >
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-card-foreground">Background</span>
            <ColorSwatches
              colors={BACKGROUND_COLORS}
              selectedId={options.backgroundColor}
              onSelect={onBackgroundColorChange}
              groupLabel="Background"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-card-foreground">Card</span>
            <ColorSwatches
              colors={CARD_COLORS}
              selectedId={options.cardColor}
              onSelect={onCardColorChange}
              groupLabel="Card"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">Hour format</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">How times appear in history.</p>
        </div>

        <SettingRow label="Clock display">
          <HourFormatPicker value={options.hourFormat} onChange={onHourFormatChange} />
        </SettingRow>
      </div>
    </div>
  )
}
