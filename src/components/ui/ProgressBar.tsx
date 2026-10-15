import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max: number
  label: string
  className?: string
}

export function ProgressBar({ value, max, label, className }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={clsx('bg-surface-2 h-3 w-full overflow-hidden rounded-full', className)}
    >
      <div
        key={pct}
        className="anim-fill bg-accent h-full rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
