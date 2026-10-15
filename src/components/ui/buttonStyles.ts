import clsx from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'md' | 'lg' | 'sm'

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
    size === 'sm' && 'min-h-11 px-4 text-sm',
    size === 'md' && 'min-h-11 px-5 text-[15px]',
    size === 'lg' && 'min-h-14 px-7 text-base',
    variant === 'primary' && 'bg-accent text-accent-ink shadow-card hover:brightness-105',
    variant === 'secondary' && 'bg-surface-2 text-ink hover:brightness-95',
    variant === 'ghost' && 'text-accent hover:bg-accent-soft',
    variant === 'danger' && 'bg-danger/10 text-danger hover:bg-danger/20',
  )
}
