"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ToprioApp } from "@/components/toprio/toprio-app"
import { parseSmallWindowParams } from "@/lib/small-window"

function SmallWindowContent() {
  const searchParams = useSearchParams()
  const params = parseSmallWindowParams(searchParams)

  return (
    <main className="mx-auto min-h-svh max-w-3xl bg-background text-foreground">
      <ToprioApp
        initialScreen={params?.screen}
        initialHistoryOrigin={params?.historyOrigin}
        initialFinishedVariant={params?.finishedVariant}
      />
    </main>
  )
}

export default function SmallWindowPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-background" aria-hidden="true" />}>
      <SmallWindowContent />
    </Suspense>
  )
}
