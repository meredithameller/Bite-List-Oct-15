import clsx from 'clsx'
import { useState } from 'react'
import { Field } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { usePlaces } from '@/hooks/usePlaces'
import { priceTierLabel } from '@/lib/format'

interface PlacePickerProps {
  value: string
  onChange: (placeId: string) => void
  error?: string
}

export function PlacePicker({ value, onChange, error }: PlacePickerProps) {
  const [query, setQuery] = useState('')
  const places = usePlaces({ query })

  return (
    <div className="flex flex-col gap-3">
      <Field
        label="Search places"
        hideLabel
        type="search"
        placeholder="Search by name, neighborhood or cuisine"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        error={error}
        autoComplete="off"
      />
      {places.isPending && (
        <div role="status" aria-busy="true" className="flex flex-col gap-2">
          <span className="sr-only">Loading places…</span>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      )}
      {places.isError && (
        <ErrorState message={places.error.message} onRetry={() => void places.refetch()} />
      )}
      {places.data && places.data.length === 0 && (
        <EmptyState
          emoji="🔎"
          title="No places match"
          body="Try a different name or neighborhood."
        />
      )}
      {places.data && places.data.length > 0 && (
        <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1" aria-label="Places">
          {places.data.map((p) => {
            const selected = p.id === value
            return (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange(p.id)}
                  className={clsx(
                    'flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-2 text-left transition',
                    selected
                      ? 'border-accent bg-accent-soft'
                      : 'border-line bg-surface hover:bg-surface-2',
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{p.name}</span>
                    <span className="text-muted block truncate text-sm">
                      {p.neighborhood}, {p.city} · {p.cuisines[0]} · {priceTierLabel(p.priceTier)}
                    </span>
                  </span>
                  {selected && <Icon name="check" className="text-accent shrink-0" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
