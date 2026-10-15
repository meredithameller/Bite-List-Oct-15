import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { PlaceImage } from '@/components/ui/PlaceImage'
import { QueryState } from '@/components/ui/QueryState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProfile, useProfileStats, useResetDemoData } from '@/hooks/useProfile'
import { useUiStore, type ThemePref } from '@/store/uiStore'
import type { ProfileStats } from '@/api'

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-3xl leading-none font-bold">{value}</p>
      <p className="text-muted mt-1 text-sm">{label}</p>
    </Card>
  )
}

function Stats({ stats }: { stats: ProfileStats }) {
  const total = stats.sponsoredVisits + stats.organicVisits
  const sponsoredPct = total === 0 ? 0 : Math.round((stats.sponsoredVisits / total) * 100)
  const maxCuisine = Math.max(1, ...stats.topCuisines.map((c) => c.count))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <StatTile value={stats.placesLogged} label="places logged" />
        <StatTile value={stats.citiesVisited} label="cities visited" />
        <StatTile value={stats.visitsLogged} label="visits" />
      </div>

      <section aria-labelledby="cuisines">
        <h2 id="cuisines" className="mb-3 text-xl font-bold">
          Top cuisines
        </h2>
        {stats.topCuisines.length === 0 ? (
          <p className="text-muted text-sm">Log a few visits to see your favorite cuisines.</p>
        ) : (
          <Card className="p-4">
            <ul className="flex flex-col gap-3">
              {stats.topCuisines.map((c) => (
                <li key={c.cuisine}>
                  <div className="mb-1 flex justify-between text-sm font-semibold">
                    <span>{c.cuisine}</span>
                    <span className="text-muted">{c.count}</span>
                  </div>
                  <div
                    className="bg-surface-2 h-2.5 overflow-hidden rounded-full"
                    aria-hidden="true"
                  >
                    <div
                      className="anim-fill bg-accent h-full rounded-full"
                      style={{ width: `${(c.count / maxCuisine) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>

      <section aria-labelledby="sponsored">
        <h2 id="sponsored" className="mb-3 text-xl font-bold">
          Sponsored vs. organic
        </h2>
        <Card className="flex flex-col gap-3 p-4">
          <div
            role="img"
            aria-label={`${stats.organicVisits} organic and ${stats.sponsoredVisits} sponsored visits`}
            className="bg-basil-soft flex h-4 overflow-hidden rounded-full"
          >
            <div className="bg-sponsor h-full" style={{ width: `${sponsoredPct}%` }} />
          </div>
          <div className="flex justify-between text-sm">
            <span>
              <span className="bg-basil mr-2 inline-block size-3 rounded-full" aria-hidden="true" />
              <strong>{stats.organicVisits}</strong> organic
            </span>
            <span>
              <span
                className="bg-sponsor mr-2 inline-block size-3 rounded-full"
                aria-hidden="true"
              />
              <strong>{stats.sponsoredVisits}</strong> sponsored
            </span>
          </div>
        </Card>
      </section>
    </div>
  )
}

const THEMES: { value: ThemePref; label: string; icon: 'sun' | 'moon' | 'globe' }[] = [
  { value: 'system', label: 'Auto', icon: 'globe' },
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
]

export function ProfilePage() {
  const profile = useProfile()
  const stats = useProfileStats()
  const reset = useResetDemoData()
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const [confirmReset, setConfirmReset] = useState(false)
  const [kitNote, setKitNote] = useState(false)

  return (
    <>
      <PageHeader title="Profile" />

      <QueryState query={profile} loading={<Skeleton className="h-24 w-full" />}>
        {(u) => (
          <Card className="mb-6 flex items-center gap-4 p-4">
            <PlaceImage photo={u.avatarUrl} className="size-16 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-bold">{u.name}</p>
              <p className="text-muted truncate text-sm">
                {u.handle} · {u.homeCity}
                {u.isCreator ? ' · Creator' : ''}
              </p>
              <p className="text-muted mt-1 text-xs">
                Loves {u.tasteProfile.cuisines.slice(0, 3).join(', ') || 'everything'}
              </p>
            </div>
          </Card>
        )}
      </QueryState>

      <h2 className="mb-3 text-2xl font-bold">Creator stats</h2>
      <QueryState query={stats} loading={<Skeleton className="h-64 w-full" />}>
        {(s) => <Stats stats={s} />}
      </QueryState>

      <div className="mt-6 flex flex-col items-start gap-2">
        <Button onClick={() => setKitNote(true)}>
          <Icon name="download" size={18} /> Export Media Kit
        </Button>
        {kitNote && (
          <p role="status" className="text-muted text-sm">
            Media kit export is coming soon. Your stats above will be included.
          </p>
        )}
      </div>

      <section aria-labelledby="settings" className="mt-10 flex flex-col gap-5">
        <h2 id="settings" className="text-xl font-bold">
          Settings
        </h2>
        <div>
          <p className="mb-2 font-semibold">Appearance</p>
          <div role="radiogroup" aria-label="Appearance" className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <Chip
                key={t.value}
                role="radio"
                aria-checked={theme === t.value}
                selected={theme === t.value}
                onClick={() => setTheme(t.value)}
              >
                <Icon name={t.icon} size={16} /> {t.label}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/onboarding"
            className="bg-surface-2 inline-flex min-h-11 items-center rounded-full px-5 font-semibold"
          >
            Retake taste quiz
          </Link>
          {api.auth.enabled && (
            <Button variant="secondary" onClick={() => void api.auth.signOut()}>
              Sign out
            </Button>
          )}
          {confirmReset ? (
            <div className="flex flex-wrap items-center gap-2" role="alert">
              <span className="text-sm">Erase your logs and start over?</span>
              <Button
                variant="danger"
                size="sm"
                disabled={reset.isPending}
                onClick={() => reset.mutate(undefined, { onSuccess: () => setConfirmReset(false) })}
              >
                {reset.isPending ? 'Resetting…' : 'Yes, reset'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              Reset my data
            </Button>
          )}
        </div>
      </section>
    </>
  )
}
