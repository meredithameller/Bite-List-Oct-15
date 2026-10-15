import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  selected?: boolean
  children: ReactNode
}

/** A toggleable pill. Exposes its state with aria-pressed. */
export function Chip({ selected = false, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={clsx(
        'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition active:scale-95',
        selected
          ? 'border-accent bg-accent text-accent-ink'
          : 'border-line bg-surface text-ink hover:bg-surface-2',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Tag({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'basil' | 'sponsor' | 'saffron'
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        tone === 'neutral' && 'bg-surface-2 text-ink',
        tone === 'accent' && 'bg-accent-soft text-accent',
        tone === 'basil' && 'bg-basil-soft text-basil',
        tone === 'sponsor' && 'bg-sponsor-soft text-sponsor',
        tone === 'saffron' && 'bg-saffron text-saffron-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}
