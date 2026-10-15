import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Chip } from '@/components/ui/Chip'
import { Logo } from '@/components/ui/Logo'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { QueryState } from '@/components/ui/QueryState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCompleteOnboarding, useProfile } from '@/hooks/useProfile'
import { APP_NAME } from '@/lib/config'
import { CITIES } from '@/lib/geo'
import { BUDGET_OPTIONS, CUISINE_ICONS, CUISINES, DIETARY_ICONS, DIETARY_NEEDS } from '@/lib/taste'
import type { User } from '@/api'
import { onboardingSchema, STEP_FIELDS, type OnboardingValues } from './schema'

const TITLES = ['What do you love to eat?', 'Budget and dietary needs', 'Where do you call home?']

function Quiz({ profile }: { profile: User }) {
  const navigate = useNavigate()
  const complete = useCompleteOnboarding()
  const [step, setStep] = useState(0)

  const { control, trigger, handleSubmit, formState } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      cuisines: profile.tasteProfile.cuisines,
      budgetTier: profile.tasteProfile.budgetTier,
      dietaryNeeds: profile.tasteProfile.dietaryNeeds,
      homeCity: profile.homeCity,
    },
  })

  const last = step === TITLES.length - 1

  async function next() {
    const ok = await trigger(STEP_FIELDS[step])
    if (ok) setStep((s) => s + 1)
  }

  const submit = handleSubmit(async (values) => {
    await complete.mutateAsync(values)
    navigate('/', { replace: true })
  })

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <div>
        <p className="text-muted mb-2 text-sm font-semibold" aria-live="polite">
          Step {step + 1} of {TITLES.length}
        </p>
        <ProgressBar value={step + 1} max={TITLES.length} label="Quiz progress" />
      </div>

      <h1 className="text-3xl font-bold">{TITLES[step]}</h1>

      {step === 0 && (
        <Controller
          control={control}
          name="cuisines"
          render={({ field }) => (
            <fieldset>
              <legend className="text-muted mb-3 text-sm">Pick as many as you like.</legend>
              <div className="flex flex-wrap gap-2">
                {CUISINES.map((c) => (
                  <Chip
                    key={c}
                    selected={field.value.includes(c)}
                    onClick={() => field.onChange(toggle(field.value, c))}
                  >
                    <span aria-hidden="true">{CUISINE_ICONS[c]}</span> {c}
                  </Chip>
                ))}
              </div>
              {formState.errors.cuisines && (
                <p role="alert" className="text-danger mt-3 text-sm font-medium">
                  {formState.errors.cuisines.message}
                </p>
              )}
            </fieldset>
          )}
        />
      )}

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <Controller
            control={control}
            name="budgetTier"
            render={({ field }) => (
              <fieldset>
                <legend className="mb-3 font-semibold">Usual budget</legend>
                <div role="radiogroup" aria-label="Usual budget" className="grid grid-cols-2 gap-2">
                  {BUDGET_OPTIONS.map((o) => (
                    <Chip
                      key={o.tier}
                      role="radio"
                      aria-checked={field.value === o.tier}
                      selected={field.value === o.tier}
                      onClick={() => field.onChange(o.tier)}
                      className="h-auto flex-col py-3"
                    >
                      <span className="text-lg">{o.label}</span>
                      <span className="text-xs font-medium opacity-80">{o.hint}</span>
                    </Chip>
                  ))}
                </div>
              </fieldset>
            )}
          />
          <Controller
            control={control}
            name="dietaryNeeds"
            render={({ field }) => (
              <fieldset>
                <legend className="mb-3 font-semibold">Dietary needs (optional)</legend>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_NEEDS.map((d) => (
                    <Chip
                      key={d}
                      selected={field.value.includes(d)}
                      onClick={() => field.onChange(toggle(field.value, d))}
                    >
                      <span aria-hidden="true">{DIETARY_ICONS[d]}</span> {d}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            )}
          />
        </div>
      )}

      {step === 2 && (
        <Controller
          control={control}
          name="homeCity"
          render={({ field }) => (
            <fieldset>
              <legend className="text-muted mb-3 text-sm">
                We will start your Next Up feed here.
              </legend>
              <div role="radiogroup" aria-label="Home city" className="flex flex-wrap gap-2">
                {CITIES.map((c) => (
                  <Chip
                    key={c}
                    role="radio"
                    aria-checked={field.value === c}
                    selected={field.value === c}
                    onClick={() => field.onChange(c)}
                  >
                    📍 {c}
                  </Chip>
                ))}
              </div>
            </fieldset>
          )}
        />
      )}

      {complete.isError && (
        <p role="alert" className="text-danger text-sm font-medium">
          {complete.error.message}
        </p>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="secondary" size="lg" onClick={() => setStep((s) => s - 1)}>
            <Icon name="back" size={20} /> Back
          </Button>
        )}
        {last ? (
          <Button
            key="submit"
            type="submit"
            size="lg"
            className="flex-1"
            disabled={complete.isPending}
          >
            {complete.isPending ? 'Saving…' : `Start eating with ${APP_NAME}`}
          </Button>
        ) : (
          <Button key="next" size="lg" className="flex-1" onClick={() => void next()}>
            Next <Icon name="arrow" size={20} />
          </Button>
        )}
      </div>
    </form>
  )
}

export function OnboardingPage() {
  const profile = useProfile()
  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 py-8">
      <Logo size="sm" className="mb-6" />
      <QueryState query={profile} loading={<Skeleton className="h-64 w-full" />}>
        {(p) => <Quiz profile={p} />}
      </QueryState>
    </div>
  )
}
