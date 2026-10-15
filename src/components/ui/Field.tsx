import clsx from 'clsx'
import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

const control =
  'bg-surface border-line text-ink placeholder:text-muted min-h-11 w-full rounded-xl border px-4 py-2.5 text-base'

interface FieldShellProps {
  label: string
  error?: string
  hint?: string
  hideLabel?: boolean
  id: string
  children: ReactNode
}

function FieldShell({ label, error, hint, hideLabel, id, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={clsx('text-sm font-semibold', hideLabel && 'sr-only')}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-muted text-xs">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-danger text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  hideLabel?: boolean
}

export function Field({ label, error, hint, hideLabel, className, id, ...rest }: FieldProps) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <FieldShell label={label} error={error} hint={hint} hideLabel={hideLabel} id={fid}>
      <input
        id={fid}
        aria-invalid={!!error}
        aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined}
        className={clsx(control, error && 'border-danger', className)}
        {...rest}
      />
    </FieldShell>
  )
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  hideLabel?: boolean
}

export function TextArea({ label, error, hint, hideLabel, className, id, ...rest }: TextAreaProps) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <FieldShell label={label} error={error} hint={hint} hideLabel={hideLabel} id={fid}>
      <textarea
        id={fid}
        rows={2}
        aria-invalid={!!error}
        aria-describedby={error ? `${fid}-err` : hint ? `${fid}-hint` : undefined}
        className={clsx(control, 'resize-none', error && 'border-danger', className)}
        {...rest}
      />
    </FieldShell>
  )
}
