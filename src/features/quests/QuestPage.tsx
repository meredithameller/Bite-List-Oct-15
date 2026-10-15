import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QueryState } from '@/components/ui/QueryState'
import { Skeleton } from '@/components/ui/Skeleton'
import { DisclosureReminder, SponsoredLabel } from '@/components/ui/SponsoredLabel'
import { EmptyState } from '@/components/ui/States'
import { usePassport } from '@/hooks/usePassport'
import { usePlaces } from '@/hooks/usePlaces'
import { useQuest, useStartQuest } from '@/hooks/useQuests'
import { deadlineLabel, priceTierLabel } from '@/lib/format'

export function QuestPage() {
  const { id } = useParams()
  const quest = useQuest(id)
  const places = usePlaces()
  const passport = usePassport()
  const start = useStartQuest()

  return (
    <QueryState
      query={quest}
      loading={
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      }
      isEmpty={(q) => q === null}
      empty={
        <>
          <PageHeader title="Quest not found" back />
          <EmptyState
            emoji="🧭"
            title="That quest has left the building"
            action={<ButtonLink to="/passport">See your quests</ButtonLink>}
          />
        </>
      }
    >
      {(q) => {
        if (!q) return null
        const { progress } = q
        const byId = new Map((places.data ?? []).map((p) => [p.id, p]))
        const doneIds = new Set(progress.qualifyingPlaceIds)
        const toTry = q.candidatePlaceIds.filter((pid) => !doneIds.has(pid))
        const badge = passport.data?.badges.find((b) => b.badge.id === q.badgeId)?.badge

        return (
          <>
            <PageHeader title={q.title} subtitle={`${q.city} · ${deadlineLabel(q.endsAt)}`} back />

            {q.sponsorName && (
              <div className="mb-4 flex flex-col gap-2">
                <div>
                  <SponsoredLabel sponsor={q.sponsorName} />
                </div>
                <DisclosureReminder />
              </div>
            )}

            <p className="mb-5">{q.description}</p>

            <Card className="mb-6 flex flex-col gap-3 p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold">Progress</h2>
                <p className="font-semibold">
                  {progress.current} / {progress.target}
                </p>
              </div>
              <ProgressBar
                value={progress.current}
                max={progress.target}
                label={`${q.title} progress`}
                className="h-4"
              />
              {progress.completed ? (
                <p className="anim-pop text-basil font-semibold">
                  🎉 Quest complete. Reward unlocked!
                </p>
              ) : (
                <p className="text-muted text-sm">
                  {progress.target - progress.current} more to go. Repeat visits to the same place
                  count once.
                </p>
              )}
              {!q.started && !progress.completed && (
                <Button
                  onClick={() => start.mutate(q.id)}
                  disabled={start.isPending}
                  className="self-start"
                >
                  {start.isPending ? 'Starting…' : 'Start Quest'}
                </Button>
              )}
              {q.started && !progress.completed && (
                <ButtonLink to="/log" variant="secondary" className="self-start">
                  Log a visit
                </ButtonLink>
              )}
            </Card>

            <section aria-labelledby="reward" className="mb-6">
              <h2 id="reward" className="mb-2 text-xl font-bold">
                Reward
              </h2>
              <Card className="flex items-center gap-4 p-4">
                <span className="text-4xl" aria-hidden="true">
                  {badge?.icon ?? '🏅'}
                </span>
                <div>
                  <p className="font-semibold">{badge?.name ?? 'Quest badge'}</p>
                  <p className="text-muted text-sm">
                    +{q.rewardPoints} points and a badge for your Passport
                  </p>
                </div>
              </Card>
            </section>

            <section aria-labelledby="rules" className="mb-6">
              <h2 id="rules" className="mb-2 text-xl font-bold">
                How it works
              </h2>
              <ul className="flex list-disc flex-col gap-1.5 pl-5">
                {q.rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="text-muted mt-2 text-sm">
                Quests are about quality, not volume. Ratings never affect rewards.
              </p>
            </section>

            <section aria-labelledby="places">
              <h2 id="places" className="mb-2 text-xl font-bold">
                Qualifying places
              </h2>
              {places.isPending ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <ul className="flex flex-col gap-2">
                  {progress.qualifyingPlaceIds.map((pid) => {
                    const p = byId.get(pid)
                    return p ? (
                      <li key={pid}>
                        <Link
                          to={`/places/${pid}`}
                          className="bg-basil-soft flex min-h-14 items-center gap-3 rounded-2xl px-4 py-2"
                        >
                          <Icon name="check" className="text-basil shrink-0" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">{p.name}</span>
                            <span className="text-muted block text-sm">Counted ✓</span>
                          </span>
                        </Link>
                      </li>
                    ) : null
                  })}
                  {toTry.map((pid) => {
                    const p = byId.get(pid)
                    return p ? (
                      <li key={pid}>
                        <Link
                          to={`/places/${pid}`}
                          className="border-line bg-surface flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-2"
                        >
                          <Icon name="pin" className="text-muted shrink-0" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">{p.name}</span>
                            <span className="text-muted block truncate text-sm">
                              {p.neighborhood} · {priceTierLabel(p.priceTier)} · to try
                            </span>
                          </span>
                        </Link>
                      </li>
                    ) : null
                  })}
                  {progress.qualifyingPlaceIds.length + toTry.length === 0 && (
                    <li className="text-muted text-sm">
                      Any place in {q.city} can count. Go explore!
                    </li>
                  )}
                </ul>
              )}
            </section>
          </>
        )
      }}
    </QueryState>
  )
}
