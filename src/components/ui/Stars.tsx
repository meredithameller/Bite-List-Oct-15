import clsx from 'clsx'
import { Icon } from './Icon'

/** Read-only star display. */
export function Stars({ value }: { value: number }) {
  return (
    <span className="text-saffron inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          size={14}
          filled={n <= value}
          className={clsx(n > value && 'opacity-30')}
        />
      ))}
    </span>
  )
}

/** Tappable 1-5 rating. Each star is a 44px target. */
export function StarInput({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (n: number) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n === value ? 0 : n)}
          className="text-saffron flex size-11 items-center justify-center"
        >
          <Icon
            name="star"
            size={26}
            filled={n <= value}
            className={clsx(n > value && 'opacity-40')}
          />
        </button>
      ))}
    </div>
  )
}
