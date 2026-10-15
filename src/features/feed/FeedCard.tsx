import { Link } from 'react-router-dom'
import type { FeedCardWithDistance } from '@/hooks/useNextUp'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Chip'
import { Icon } from '@/components/ui/Icon'
import { PlaceImage } from '@/components/ui/PlaceImage'
import { SponsoredLabel } from '@/components/ui/SponsoredLabel'
import { placeArt } from '@/lib/image'
import { formatDistance, priceTierLabel } from '@/lib/format'

interface FeedCardProps {
  card: FeedCardWithDistance
  saved: boolean
  onSave: () => void
  onDismiss: () => void
  onStartQuest: (questId: string) => void
  busy?: boolean
}

export function FeedCardView({
  card,
  saved,
  onSave,
  onDismiss,
  onStartQuest,
  busy,
}: FeedCardProps) {
  const { place, quest } = card
  return (
    <Card className="overflow-hidden">
      <article aria-labelledby={`feed-${card.id}`}>
        <div className="relative">
          <Link to={`/places/${place.id}`} tabIndex={-1} aria-hidden="true">
            <PlaceImage photo={placeArt(place)} className="aspect-[4/3] w-full" />
          </Link>
          {card.isSponsored && (
            <div className="absolute top-3 left-3">
              <SponsoredLabel />
            </div>
          )}
          {place.isNewOpening && (
            <div className="absolute top-3 right-3">
              <Tag tone="saffron">✨ New</Tag>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div>
            <h2 id={`feed-${card.id}`} className="text-xl leading-snug font-bold">
              <Link to={`/places/${place.id}`} className="hover:underline">
                {place.name}
              </Link>
            </h2>
            <p className="text-muted mt-1 flex flex-wrap items-center gap-x-2 text-sm">
              <span className="inline-flex items-center gap-1">
                <Icon name="pin" size={14} /> {formatDistance(card.distanceKm)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{priceTierLabel(place.priceTier)}</span>
              <span aria-hidden="true">·</span>
              <span>{place.neighborhood}</span>
            </p>
          </div>

          <p className="bg-surface-2 rounded-xl px-3 py-2 text-sm">
            <span className="font-semibold">Why this pick: </span>
            {card.reason}
          </p>

          {quest && (
            <Link
              to={`/quests/${quest.id}`}
              className="border-accent/40 bg-accent-soft block min-h-11 rounded-xl border px-3 py-2"
            >
              <p className="text-accent text-sm font-semibold">🎯 Quest: {quest.title}</p>
              <p className="text-muted text-xs">
                {quest.progress.current} of {quest.progress.target} done · see details
              </p>
            </Link>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant={saved ? 'secondary' : 'primary'}
              onClick={onSave}
              disabled={busy}
              aria-pressed={saved}
              className="flex-1"
            >
              <span key={String(saved)} className={saved ? 'anim-pop inline-flex' : 'inline-flex'}>
                <Icon name="heart" size={18} filled={saved} />
              </span>
              {saved ? 'Saved' : 'Save'}
            </Button>
            {quest && (
              <Button
                variant="secondary"
                onClick={() => (quest.started ? undefined : onStartQuest(quest.id))}
                disabled={busy}
                className="flex-1"
              >
                {quest.started ? '🎯 In progress' : 'Start Quest'}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={onDismiss}
              disabled={busy}
              aria-label={`Dismiss ${place.name}`}
            >
              <Icon name="x" size={18} /> Dismiss
            </Button>
          </div>
        </div>
      </article>
    </Card>
  )
}
