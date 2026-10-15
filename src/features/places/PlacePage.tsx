import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Chip'
import { PlaceImage } from '@/components/ui/PlaceImage'
import { QueryState } from '@/components/ui/QueryState'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/States'
import { usePlace } from '@/hooks/usePlaces'
import { usePlaceVisits } from '@/hooks/useVisits'
import { useWishlist } from '@/hooks/useWishlist'
import { priceTierLabel } from '@/lib/format'
import { placeArt } from '@/lib/image'
import { usualOrder } from '@/lib/visits'
import { AddToWishlist } from './AddToWishlist'
import { MapPlaceholder } from './MapPlaceholder'
import { VisitCard } from './VisitCard'

function PlaceSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="aspect-[16/9] w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

export function PlacePage() {
  const { id } = useParams()
  const place = usePlace(id)
  const visits = usePlaceVisits(id)
  const wishlist = useWishlist()

  return (
    <QueryState
      query={place}
      loading={<PlaceSkeleton />}
      isEmpty={(p) => p === null}
      empty={
        <>
          <PageHeader title="Place not found" back />
          <EmptyState
            emoji="🗺️"
            title="We couldn't find that place"
            action={<ButtonLink to="/">Back to Next Up</ButtonLink>}
          />
        </>
      }
    >
      {(p) => {
        if (!p) return null
        const entry = wishlist.data?.find((w) => w.placeId === p.id)
        return (
          <>
            <PageHeader title={p.name} subtitle={`${p.neighborhood}, ${p.city}`} back />
            <PlaceImage
              photo={placeArt(p)}
              alt={`${p.name} illustration`}
              className="mb-4 aspect-[16/9] w-full rounded-[1.25rem]"
            />

            <div className="mb-4 flex flex-wrap gap-1.5">
              <Tag>{priceTierLabel(p.priceTier)}</Tag>
              {p.cuisines.map((c) => (
                <Tag key={c} tone="accent">
                  {c}
                </Tag>
              ))}
              {p.isNewOpening && <Tag tone="saffron">✨ New opening</Tag>}
            </div>

            <div className="mb-8 flex flex-col items-start gap-3">
              <ButtonLink to={`/log?place=${p.id}`}>Log a visit</ButtonLink>
              <AddToWishlist placeId={p.id} entry={entry} />
            </div>

            <QueryState
              query={visits}
              loading={<Skeleton className="h-40 w-full" />}
              isEmpty={(v) => v.length === 0}
              empty={
                <EmptyState
                  emoji="📝"
                  title="You haven't been here yet"
                  body="Log a visit and your dishes will show up here, including your usual order."
                  action={<ButtonLink to={`/log?place=${p.id}`}>Log a visit</ButtonLink>}
                />
              }
            >
              {(vs) => {
                const usual = usualOrder(vs)
                return (
                  <div className="flex flex-col gap-8">
                    <section aria-labelledby="usual">
                      <h2 id="usual" className="mb-3 text-xl font-bold">
                        My Usual Order
                      </h2>
                      {usual.length === 0 ? (
                        <p className="text-muted text-sm">
                          Mark a dish “order again” when you log a visit and it will land here.
                        </p>
                      ) : (
                        <Card>
                          <ul className="divide-line divide-y">
                            {usual.map((u) => (
                              <li key={u.name} className="flex items-start gap-3 p-4">
                                <span aria-hidden="true" className="text-2xl">
                                  {u.type === 'drink' ? '🥤' : '🍽️'}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold">{u.name}</p>
                                  {u.note && <p className="text-muted text-sm">“{u.note}”</p>}
                                </div>
                                <Tag tone="accent">🔁 ×{u.times}</Tag>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      )}
                    </section>

                    <section aria-labelledby="visits">
                      <h2 id="visits" className="mb-3 text-xl font-bold">
                        My visits ({vs.length})
                      </h2>
                      <ul className="flex flex-col gap-3">
                        {vs.map((v) => (
                          <li key={v.id}>
                            <VisitCard visit={v} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                )
              }}
            </QueryState>

            <section aria-labelledby="map" className="mt-8">
              <h2 id="map" className="mb-3 text-xl font-bold">
                Location
              </h2>
              <MapPlaceholder place={p} />
            </section>
          </>
        )
      }}
    </QueryState>
  )
}
