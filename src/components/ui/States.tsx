import type { ReactNode } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'

export function EmptyState({
  emoji = '🍽️',
  title,
  body,
  action,
}: {
  emoji?: string
  title: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="border-line flex flex-col items-center gap-3 rounded-[1.25rem] border border-dashed px-6 py-12 text-center">
      <span className="text-5xl" aria-hidden="true">
        {emoji}
      </span>
      <h2 className="text-xl font-bold">{title}</h2>
      {body && <p className="text-muted max-w-sm">{body}</p>}
      {action}
    </div>
  )
}

export function ErrorState({
  message = 'Something went wrong in the kitchen.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="bg-danger/10 flex flex-col items-center gap-3 rounded-[1.25rem] px-6 py-10 text-center"
    >
      <Icon name="alert" size={36} className="text-danger" />
      <h2 className="text-xl font-bold">Hmm, that didn’t load</h2>
      <p className="text-muted max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
