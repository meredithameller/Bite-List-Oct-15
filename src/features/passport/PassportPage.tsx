import clsx from 'clsx'
import type { BadgeStatus, PassportData } from '@/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { QueryState } from '@/components/ui/QueryState'
import { Skeleton } from '@/components/ui/Skeleton'
import { QuestCard } from '@/features/quests/QuestCard'
import { usePassport } from '@/hooks/usePassport'
import { useQuests } from '@/hooks/useQuests'
import { formatShortDate } from '@/lib/format'

function Stat({ icon, value, label }: { icon: 'trophy' | 'flame'; value: number; label: string }) {
  return (
    <Card className="flex flex-1 items-center gap-3 p-4">
      <span className="bg-accent-soft text-accent flex size-12 items-center justify-center rounded-full">
        <Icon name={icon} size={26} />
      </span>
      <div>
        <p className="text-2xl leading-none font-bold">{value}</p>
        <p className="text-muted text-sm">{label}</p>
      </div>
    </Card>
  )
}

const CITY_EMOJI: Record<string, string> = { Tampa: '🌴', Nashville: '🎸' }

function Stamps({ data }: { data: PassportData }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {data.allCities.map((city) => {
        const stamp = data.stamps.find((s) => s.city === city)
        return (
          <li key={city}>
            <div
              className={clsx(
                'flex h-full flex-col items-center gap-1 rounded-[1.25rem] border-2 p-4 text-center',
                stamp
                  ? 'border-accent bg-accent-soft -rotate-1'
                  : 'border-line border-dashed opacity-70',
              )}
            >
              <span className="text-3xl" aria-hidden="true">
                {stamp ? CITY_EMOJI[city] : '🔒'}
              </span>
              <p className="font-display text-lg font-bold">{city}</p>
              {stamp ? (
                <p className="text-muted text-xs">
                  {stamp.placeCount} place{stamp.placeCount === 1 ? '' : 's'} · {stamp.visitCount}{' '}
                  visit
                  {stamp.visitCount === 1 ? '' : 's'}
                  <br />
                  since {formatShortDate(stamp.firstVisit)}
                </p>
              ) : (
                <p className="text-muted text-xs">Log a visit here to earn this stamp</p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function Badges({ badges }: { badges: BadgeStatus[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {badges.map(({ badge, earned, hint }) => (
        <li key={badge.id}>
          <div
            className={clsx(
              'border-line flex h-full flex-col items-center gap-1 rounded-[1.25rem] border p-3 text-center',
              earned ? 'bg-surface shadow-card' : 'bg-surface-2 opacity-75',
            )}
          >
            <span
              className={clsx('text-4xl', earned ? 'anim-pop' : 'opacity-40 grayscale')}
              aria-hidden="true"
            >
              {badge.icon}
            </span>
            <p className="text-sm font-bold">
              {badge.name}
              <span className="sr-only">{earned ? ' (earned)' : ' (locked)'}</span>
            </p>
            <p className="text-muted text-xs">{earned ? badge.description : hint}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function PassportPage() {
  const passport = usePassport()
  const quests = useQuests()

  return (
    <>
      <PageHeader
        title="Passport & Rewards"
        subtitle="Points come from logging. Your ratings never change them."
      />
      <QueryState
        query={passport}
        loading={
          <div className="flex flex-col gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        {(data) => (
          <div className="flex flex-col gap-8">
            <div className="flex gap-3">
              <Stat icon="trophy" value={data.points} label="points" />
              <Stat
                icon="flame"
                value={data.streak}
                label={data.streak === 1 ? 'day streak' : 'day streak'}
              />
            </div>
            {data.streak === 0 && (
              <p className="text-muted -mt-4 text-sm">Log something today to start a streak.</p>
            )}

            <section aria-labelledby="stamps">
              <h2 id="stamps" className="mb-3 text-xl font-bold">
                City stamps
              </h2>
              <Stamps data={data} />
            </section>

            <section aria-labelledby="badges">
              <h2 id="badges" className="mb-3 text-xl font-bold">
                Badges ({data.badges.filter((b) => b.earned).length}/{data.badges.length})
              </h2>
              <Badges badges={data.badges} />
            </section>
          </div>
        )}
      </QueryState>

      <section aria-labelledby="quests" className="mt-8">
        <h2 id="quests" className="mb-3 text-xl font-bold">
          Quests
        </h2>
        <QueryState
          query={quests}
          loading={<Skeleton className="h-32 w-full" />}
          isEmpty={(q) => q.length === 0}
          empty={<p className="text-muted">No quests right now. Check back soon.</p>}
        >
          {(list) => (
            <ul className="flex flex-col gap-3">
              {list.map((q) => (
                <li key={q.id}>
                  <QuestCard quest={q} />
                </li>
              ))}
            </ul>
          )}
        </QueryState>
      </section>
    </>
  )
}
