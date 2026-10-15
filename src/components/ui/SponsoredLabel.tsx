import { Tag } from './Chip'

/** Always shown on sponsored content. Never hide or shrink this. */
export function SponsoredLabel({ sponsor }: { sponsor?: string | null }) {
  return <Tag tone="sponsor">📢 Sponsored{sponsor ? ` · ${sponsor}` : ''}</Tag>
}

/** Reminder shown wherever a sponsored visit is logged or displayed. */
export function DisclosureReminder() {
  return (
    <p
      role="note"
      className="bg-sponsor-soft text-sponsor rounded-xl px-3 py-2 text-sm font-medium"
    >
      Remember to disclose this partnership when you post (#ad or “paid partnership”). Your
      followers trust you.
    </p>
  )
}
