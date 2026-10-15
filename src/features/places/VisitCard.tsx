import type { VisitWithItems } from '@/api'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Chip'
import { PlaceImage } from '@/components/ui/PlaceImage'
import { DisclosureReminder, SponsoredLabel } from '@/components/ui/SponsoredLabel'
import { Stars } from '@/components/ui/Stars'
import { formatDate, money } from '@/lib/format'

const WORTH: Record<
  VisitWithItems['worthIt'],
  { label: string; tone: 'basil' | 'neutral' | 'accent' }
> = {
  yes: { label: '😍 Worth it', tone: 'basil' },
  meh: { label: '😐 Meh', tone: 'neutral' },
  no: { label: '👎 Not worth it', tone: 'accent' },
}

export function VisitCard({ visit }: { visit: VisitWithItems }) {
  const worth = WORTH[visit.worthIt]
  const photo = visit.photos[0]
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        {photo && <PlaceImage photo={photo} alt="" className="size-16 shrink-0 rounded-xl" />}
        <div className="min-w-0 flex-1">
          <p className="font-bold">{formatDate(visit.date)}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Tag tone={worth.tone}>{worth.label}</Tag>
            <Tag>{money(visit.totalSpend)}</Tag>
            {visit.tripTag && <Tag tone="saffron">✈️ {visit.tripTag}</Tag>}
            {visit.isSponsored && <SponsoredLabel sponsor={visit.sponsorName} />}
          </div>
        </div>
      </div>
      {visit.notes && <p className="text-sm">{visit.notes}</p>}
      {visit.items.length > 0 && (
        <ul className="divide-line divide-y text-sm">
          {visit.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2">
              <span className="min-w-0">
                <span className="font-semibold">{item.name}</span>
                {item.orderAgain && (
                  <span className="text-accent ml-1.5 text-xs font-semibold">🔁 order again</span>
                )}
              </span>
              <Stars value={item.rating} />
            </li>
          ))}
        </ul>
      )}
      {visit.isSponsored && <DisclosureReminder />}
    </Card>
  )
}
