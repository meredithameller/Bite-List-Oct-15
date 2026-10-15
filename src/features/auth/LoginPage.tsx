import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '@/api'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { Field } from '@/components/ui/Field'
import { useSession } from '@/hooks/useSession'
import { authSchema, type AuthValues } from './schema'

type Mode = 'signIn' | 'signUp'

export function LoginPage() {
  const session = useSession()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signIn')
  const [error, setError] = useState<string | null>(null)
  const [checkEmail, setCheckEmail] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: '', password: '', name: '' },
  })

  if (!api.auth.enabled || session.status === 'signedIn') return <Navigate to="/" replace />

  const submit = handleSubmit(async (values) => {
    setError(null)
    if (mode === 'signUp' && values.name.trim() === '') {
      setFieldError('name', { message: 'Tell us what to call you' })
      return
    }
    try {
      if (mode === 'signIn') {
        await api.auth.signIn(values.email, values.password)
        navigate('/', { replace: true })
      } else {
        const { needsConfirmation } = await api.auth.signUp(
          values.email,
          values.password,
          values.name,
        )
        if (needsConfirmation) setCheckEmail(true)
        else navigate('/', { replace: true })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    }
  })

  function switchMode() {
    setMode((m) => (m === 'signIn' ? 'signUp' : 'signIn'))
    setError(null)
    setCheckEmail(false)
    reset()
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-4 py-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1>
          <Logo size="lg" />
          <span className="sr-only"> logo</span>
        </h1>
        <p className="text-muted">Log every bite. Find your next favorite.</p>
      </div>

      {checkEmail ? (
        <div role="status" className="bg-basil-soft text-ink rounded-[1.25rem] p-6 text-center">
          <p className="text-3xl" aria-hidden="true">
            📬
          </p>
          <h2 className="mt-2 text-xl font-bold">Check your email</h2>
          <p className="text-muted mt-1">
            We sent a confirmation link. Click it, then come back here to sign in.
          </p>
          <Button variant="secondary" className="mt-4" onClick={switchMode}>
            Back to sign in
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">
            {mode === 'signIn' ? 'Welcome back' : 'Create your account'}
          </h2>
          {mode === 'signUp' && (
            <Field
              label="Your name"
              autoComplete="name"
              placeholder="e.g. Mara Delgado"
              error={errors.name?.message}
              {...register('name')}
            />
          )}
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Field
            label="Password"
            type="password"
            autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
            hint={mode === 'signUp' ? 'At least 6 characters' : undefined}
            error={errors.password?.message}
            {...register('password')}
          />
          {error && (
            <p role="alert" className="text-danger text-sm font-medium">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'One sec…' : mode === 'signIn' ? 'Sign in' : 'Create account'}
          </Button>
          <button type="button" onClick={switchMode} className="text-accent min-h-11 font-semibold">
            {mode === 'signIn' ? 'New here? Create an account' : 'Have an account? Sign in'}
          </button>
        </form>
      )}
    </div>
  )
}
