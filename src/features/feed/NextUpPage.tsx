import { PageHeader } from '@/components/layout/PageHeader'
import { Chip } from '@/components/ui/Chip'
import { QueryState } from '@/components/ui/QueryState'
import { Skeleton } from '@/components/ui/Skeleton'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/States'
import { useDismissFeedItem, useNextUp } from '@/hooks/useNextUp'
import { useCurrentCity, useProfile } from '@/hooks/useProfile'
import { useStartQuest } from '@/hooks/useQuests'
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist'
import { CITIES } from '@/lib/geo'
import { APP_NAME } from '@/lib/config'
import { useUiStore } from '@/store/uiStore'
import { FeedCardView } from './FeedCard'

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {[0, 1].map((i) => (
        <div key={i} className="bg-surface border-line overflow-hidden rounded-[1.25rem] border">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="flex flex-col gap-3 p-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function NextUpPage() {
  const feed = useNextUp()
  const profile = useProfile()
  const city = useCurrentCity()
  const setMockCity = useUiStore((s) => s.setMockCity)
  const wishlist = useWishlist()
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const dismiss = useDismissFeedItem()
  const startQuest = useStartQuest()

  const savedIds = new Set(wishlist.data?.map((w) => w.placeId))
  const firstName = profile.data?.name.split(' ')[0]

  return (
    <>
      <PageHeader
        title={firstName ? `Hungry, ${firstName}?` : 'Next Up'}
        subtitle={`Your next few bites on ${APP_NAME}, picked for your taste.`}
      />

      <div
        role="group"
        aria-label="Where are you eating?"
        className="mb-5 flex flex-wrap items-center gap-2"
      >
        <span className="text-muted text-sm font-semibold">Eating in:</span>
        {CITIES.map((c) => (
          <Chip key={c} selected={city === c} onClick={() => setMockCity(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <QueryState
        query={feed}
        loading={<FeedSkeleton />}
        isEmpty={(cards) => cards.length === 0}
        empty={
          <EmptyState
            emoji="🍽️"
            title="You're all caught up"
            body={`No new picks in ${city} right now. Log a visit or check back soon.`}
            action={<ButtonLink to="/log">Log a visit</ButtonLink>}
          />
        }
      >
        {(cards) => (
          <ul className="flex flex-col gap-5" aria-label="Next up picks">
            {cards.map((card) => {
              const saved = savedIds.has(card.placeId)
              return (
                <li key={card.id}>
                  <FeedCardView
                    card={card}
                    saved={saved}
                    onSave={() =>
                      saved
                        ? removeFromWishlist.mutate(card.placeId)
                        : addToWishlist.mutate({
                            placeId: card.placeId,
                            source: 'other',
                            note: 'Saved from Next Up',
                          })
                    }
                    onDismiss={() => dismiss.mutate(card.id)}
                    onStartQuest={(id) => startQuest.mutate(id)}
                    busy={dismiss.isPending && dismiss.variables === card.id}
                  />
                </li>
              )
            })}
          </ul>
        )}
      </QueryState>
    </>
  )
}
