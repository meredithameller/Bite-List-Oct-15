import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { VisitWithItems } from '@/api'
import { Icon } from '@/components/ui/Icon'
import { LogForm } from '@/features/log/LogForm'
import { LogSuccess } from '@/features/log/LogSuccess'

/** Quick Log lives outside the tab shell so it can be a focused, full-screen flow. */
export function LogRoute() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [result, setResult] = useState<{ visit: VisitWithItems; points: number } | null>(null)
  const [formKey, setFormKey] = useState(0)

  return (
    <div className="min-h-dvh">
      <header className="border-line bg-bg/95 sticky top-0 z-20 border-b backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Close quick log"
            className="bg-surface-2 flex size-11 items-center justify-center rounded-full"
          >
            <Icon name="x" />
          </button>
          <h1 className="text-xl font-bold">Quick log</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pt-6">
        {result ? (
          <LogSuccess
            visit={result.visit}
            pointsEarned={result.points}
            onLogAnother={() => {
              setResult(null)
              setFormKey((k) => k + 1)
            }}
          />
        ) : (
          <LogForm
            key={formKey}
            initialPlaceId={params.get('place') ?? undefined}
            onSaved={(visit, points) => setResult({ visit, points })}
          />
        )}
      </main>
    </div>
  )
}
