import clsx from 'clsx'
import { useId, type ReactNode } from 'react'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  description?: string
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  const id = useId()
  return (
    <div className="flex min-h-11 items-center justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block font-semibold">
          {label}
        </label>
        {description && <p className="text-muted text-sm">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative h-8 w-14 shrink-0 rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-line',
        )}
      >
        <span
          className={clsx(
            'absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-6',
          )}
        />
      </button>
    </div>
  )
}
