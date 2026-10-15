import clsx from 'clsx'

/** Shimmering placeholder block. Decorative; the parent should announce loading. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={clsx('skeleton rounded-xl', className)} />
}
