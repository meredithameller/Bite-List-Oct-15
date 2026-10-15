import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { City, WishlistSource } from '@/api'
import { PageHeader } from '@/components/layout/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Chip, Tag } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { PlaceImage } from '@/components/ui/PlaceImage'
import { QueryState } from '@/components/ui/QueryState'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/States'
import { useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist'
import { priceTierLabel, timeAgo } from '@/lib/format'
import { CITIES } from '@/lib/geo'
import { placeArt } from '@/lib/image'
import { SOURCES, sourceEmoji, sourceLabel } from './sources'

export function WishlistPage() {
  const wishlist = useWishlist()
  const remove = useRemoveFromWishlist()
  const [city, setCity] = useState<City | 'all'>('all')
  const [source, setSource] = useState<WishlistSource | 'all'>('all')

  return (
    <>
      <PageHeader
        title="Wishlist"
        subtitle="Places you want to try, and who put them on your radar."
      />

      <div className="mb-5 flex flex-col gap-3">
        <div role="group" aria-label="Filter by city" className="flex flex-wrap gap-2">
          <Chip selected={city === 'all'} onClick={() => setCity('all')}>
            All cities
          </Chip>
          {CITIES.map((c) => (
            <Chip key={c} selected={city === c} onClick={() => setCity(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Filter by source" className="flex flex-wrap gap-2">
          <Chip selected={source === 'all'} onClick={() => setSource('all')}>
            Any source
          </Chip>
          {SOURCES.map((s) => (
            <Chip key={s.value} selected={source === s.value} onClick={() => setSource(s.value)}>
              <span aria-hidden="true">{s.emoji}</span> {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <QueryState
        query={wishlist}
        loading={
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        }
        isEmpty={(rows) => rows.length === 0}
        empty={
          <EmptyState
            emoji="💌"
            title="Nothing saved yet"
            body="Tap Save on a Next Up pick, or add a place from its page, and it will show up here."
            action={<ButtonLink to="/">See Next Up</ButtonLink>}
          />
        }
      >
        {(rows) => {
          const filtered = rows.filter(
            (r) =>
              (city === 'all' || r.place.city === city) &&
              (source === 'all' || r.source === source),
          )
          if (filtered.length === 0) {
            return (
              <EmptyState
                emoji="🔎"
                title="No matches"
                body="Nothing on your wishlist fits those filters."
                action={
                  <button
                    type="button"
                    className="text-accent min-h-11 rounded-full px-5 font-semibold"
                    onClick={() => {
                      setCity('all')
                      setSource('all')
                    }}
                  >
                    Clear filters
                  </button>
                }
              />
            )
          }
          return (
            <ul className="flex flex-col gap-3" aria-label="Wishlist">
              {filtered.map((row) => (
                <li key={row.placeId}>
                  <Card className="flex gap-3 p-3">
                    <Link
                      to={`/places/${row.placeId}`}
                      className="shrink-0"
                      aria-hidden="true"
                      tabIndex={-1}
                    >
                      <PlaceImage photo={placeArt(row.place)} className="size-24 rounded-xl" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-lg leading-snug font-bold">
                        <Link to={`/places/${row.placeId}`} className="hover:underline">
                          {row.place.name}
                        </Link>
                      </h2>
                      <p className="text-muted truncate text-sm">
                        {row.place.neighborhood}, {row.place.city} ·{' '}
                        {priceTierLabel(row.place.priceTier)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Tag tone="accent">
                          {sourceEmoji(row.source)} {sourceLabel(row.source)}
                        </Tag>
                        <span className="text-muted text-xs">Added {timeAgo(row.addedAt)}</span>
                      </div>
                      {row.note && <p className="mt-1.5 text-sm break-words">“{row.note}”</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove.mutate(row.placeId)}
                      aria-label={`Remove ${row.place.name} from wishlist`}
                      className="text-muted hover:bg-surface-2 flex size-11 shrink-0 items-center justify-center self-start rounded-full"
                    >
                      <Icon name="trash" size={20} />
                    </button>
                  </Card>
                </li>
              ))}
            </ul>
          )
        }}
      </QueryState>
    </>
  )
}
