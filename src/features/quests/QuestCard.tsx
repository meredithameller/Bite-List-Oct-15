import { Link } from 'react-router-dom'
import type { Quest } from '@/api'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SponsoredLabel } from '@/components/ui/SponsoredLabel'
import { deadlineLabel } from '@/lib/format'

export function QuestCard({ quest }: { quest: Quest }) {
  const { progress } = quest
  return (
    <Card className="p-4">
      <Link to={`/quests/${quest.id}`} className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug font-bold">{quest.title}</h3>
          <Icon name="chevron" className="text-muted mt-1 shrink-0" />
        </div>
        {quest.sponsorName && <SponsoredLabel sponsor={quest.sponsorName} />}
        <p className="text-muted text-sm">
          {quest.city} · {deadlineLabel(quest.endsAt)}
        </p>
        <ProgressBar
          value={progress.current}
          max={progress.target}
          label={`${quest.title} progress`}
        />
        <p className="text-sm font-semibold">
          {progress.completed ? '✅ Complete' : `${progress.current} of ${progress.target} done`}
          <span className="text-muted font-normal"> · {quest.rewardPoints} pts + badge</span>
        </p>
      </Link>
    </Card>
  )
}
