import type { VisitWithItems } from '@/api'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DisclosureReminder } from '@/components/ui/SponsoredLabel'

interface LogSuccessProps {
  visit: VisitWithItems
  pointsEarned: number
  onLogAnother: () => void
}

export function LogSuccess({ visit, pointsEarned, onLogAnother }: LogSuccessProps) {
  return (
    <Card className="flex flex-col items-center gap-4 p-8 text-center" role="status">
      <span className="anim-pop text-6xl" aria-hidden="true">
        🎉
      </span>
      <h2 className="text-2xl font-bold">Logged!</h2>
      <p className="text-muted">
        <strong className="text-ink">+{pointsEarned} points</strong> for keeping your food journal
        up to date. Points are for logging, not for ratings.
      </p>
      {visit.isSponsored && <DisclosureReminder />}
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <ButtonLink to={`/places/${visit.placeId}`}>View place</ButtonLink>
        <button
          type="button"
          onClick={onLogAnother}
          className="text-accent min-h-11 rounded-full px-5 font-semibold"
        >
          Log another
        </button>
        <ButtonLink to="/" variant="ghost">
          Back to Next Up
        </ButtonLink>
      </div>
    </Card>
  )
}
