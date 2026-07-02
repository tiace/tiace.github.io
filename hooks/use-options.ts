"use client"

import { useCallback, useEffect, useState } from "react"
import {
  type HourFormat,
  type OptionsState,
  OPTIONS_STORAGE_KEY,
  applyOptions,
  defaultOptions,
  loadOptions,
  saveOptions,
} from "@/lib/options"

export function useOptions() {
  const [options, setOptions] = useState<OptionsState>(defaultOptions)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const loaded = loadOptions()
    setOptions(loaded)
    applyOptions(loaded)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveOptions(options)
    applyOptions(options)
  }, [options, hydrated])

  useEffect(() => {
    if (!hydrated) return
    function onStorage(e: StorageEvent) {
      if (e.key !== OPTIONS_STORAGE_KEY || !e.newValue) return
      try {
        const loaded = loadOptions()
        setOptions(loaded)
        applyOptions(loaded)
      } catch {
        // ignore parse errors
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [hydrated])

  const setDarkMode = useCallback((darkMode: boolean) => {
    setOptions((current) => ({ ...current, darkMode }))
  }, [])

  const setNotifications = useCallback((notifications: boolean) => {
    setOptions((current) => ({ ...current, notifications }))
    if (notifications && typeof Notification !== "undefined" && Notification.permission === "default") {
      void Notification.requestPermission()
    }
  }, [])

  const setBackgroundColor = useCallback((backgroundColor: string) => {
    setOptions((current) => ({ ...current, backgroundColor }))
  }, [])

  const setCardColor = useCallback((cardColor: string) => {
    setOptions((current) => ({ ...current, cardColor }))
  }, [])

  const setHourFormat = useCallback((hourFormat: HourFormat) => {
    setOptions((current) => ({ ...current, hourFormat }))
  }, [])

  return {
    options,
    hydrated,
    setDarkMode,
    setNotifications,
    setBackgroundColor,
    setCardColor,
    setHourFormat,
  }
}
