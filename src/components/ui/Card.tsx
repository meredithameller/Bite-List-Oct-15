import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('bg-surface border-line shadow-card rounded-[1.25rem] border', className)}
      {...rest}
    />
  )
}
