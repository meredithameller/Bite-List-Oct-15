import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState, type ReactNode } from 'react'
import { Controller, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { VisitWithItems } from '@/api'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Field, TextArea } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { DisclosureReminder } from '@/components/ui/SponsoredLabel'
import { Toggle } from '@/components/ui/Toggle'
import { useCreateVisit, useVisits } from '@/hooks/useVisits'
import { computeVisitPoints } from '@/lib/rewards'
import { useDraftLogStore } from '@/store/draftLogStore'
import { DishRow } from './DishRow'
import { PhotoPicker } from './PhotoPicker'
import { PlacePicker } from './PlacePicker'
import {
  defaultLogValues,
  emptyDish,
  hasDraftContent,
  logFormSchema,
  toNewVisit,
  type LogFormValues,
} from './schema'

interface LogFormProps {
  initialPlaceId?: string
  onSaved: (visit: VisitWithItems, pointsEarned: number) => void
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`} className="flex flex-col gap-3">
      <h2 id={`step-${n}`} className="flex items-center gap-2 text-lg font-bold">
        <span className="bg-accent text-accent-ink flex size-7 items-center justify-center rounded-full text-sm">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

const WORTH_OPTIONS = [
  { value: 'yes', label: '😍 Worth it' },
  { value: 'meh', label: '😐 Meh' },
  { value: 'no', label: '👎 Not worth it' },
] as const

const VISIBILITY_OPTIONS = [
  { value: 'private', label: 'Just me', icon: 'lock' },
  { value: 'friends', label: 'Friends', icon: 'users' },
  { value: 'public', label: 'Public', icon: 'globe' },
] as const

export function LogForm({ initialPlaceId, onSaved }: LogFormProps) {
  const draft = useDraftLogStore((s) => s.values)
  const setDraft = useDraftLogStore((s) => s.setValues)
  const clearDraft = useDraftLogStore((s) => s.clear)
  const markSaved = useDraftLogStore((s) => s.markSaved)
  const openDraft = useDraftLogStore((s) => s.open)
  const visits = useVisits()
  const createVisit = useCreateVisit()

  // Read once: was there a draft when we opened?
  const [restored, setRestored] = useState(() => !!draft && hasDraftContent(draft))
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logFormSchema),
    defaultValues: {
      ...(draft ?? defaultLogValues()),
      ...(initialPlaceId ? { placeId: initialPlaceId } : {}),
    },
  })
  const { control, register, handleSubmit, reset, formState } = form
  const { errors, isSubmitting } = formState
  const dishes = useFieldArray({ control, name: 'dishes' })

  // Autosave the draft (debounced). Skipped once the visit has been saved.
  useEffect(() => {
    openDraft()
    let timer: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        clearTimeout(timer)
        timer = setTimeout(() => setDraft(values), 250)
      },
    })
    return () => {
      clearTimeout(timer)
      unsubscribe()
      setDraft(form.getValues())
    }
  }, [setDraft, openDraft, form])

  const isSponsored = useWatch({ control, name: 'isSponsored' })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null)
    try {
      const previous = visits.data ?? []
      const created = await createVisit.mutateAsync(toNewVisit(values))
      markSaved()
      const earned = computeVisitPoints([...previous, created]) - computeVisitPoints(previous)
      onSaved(created, earned)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'We could not save that visit.')
    }
  })

  function startFresh() {
    clearDraft()
    reset(defaultLogValues())
    setRestored(false)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8 pb-32">
        {restored && (
          <div
            role="status"
            className="bg-saffron/25 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm"
          >
            <span>
              <strong>Welcome back.</strong> We saved your unfinished log.
            </span>
            <Button variant="secondary" size="sm" onClick={startFresh}>
              Start fresh
            </Button>
          </div>
        )}

        <Step n={1} title="Where did you eat?">
          <Controller
            control={control}
            name="placeId"
            render={({ field }) => (
              <PlacePicker
                value={field.value}
                onChange={field.onChange}
                error={errors.placeId?.message}
              />
            )}
          />
        </Step>

        <Step n={2} title="Worth it?">
          <Controller
            control={control}
            name="worthIt"
            render={({ field }) => (
              <div role="radiogroup" aria-label="Was it worth it?" className="flex flex-wrap gap-2">
                {WORTH_OPTIONS.map((o) => (
                  <Chip
                    key={o.value}
                    role="radio"
                    aria-checked={field.value === o.value}
                    selected={field.value === o.value}
                    onClick={() => field.onChange(o.value)}
                  >
                    {o.label}
                  </Chip>
                ))}
              </div>
            )}
          />
          <div className="max-w-48">
            <Field
              label="Total spend ($)"
              inputMode="decimal"
              placeholder="e.g. 24.50"
              error={errors.totalSpend?.message}
              {...register('totalSpend')}
            />
          </div>
        </Step>

        <Step n={3} title="What did you order?">
          {dishes.fields.length === 0 && (
            <p className="text-muted text-sm">
              Skip this for a quick log, or add the dishes you want to remember.
            </p>
          )}
          <div className="flex flex-col gap-3">
            {dishes.fields.map((f, i) => (
              <DishRow key={f.id} index={i} onRemove={() => dishes.remove(i)} />
            ))}
          </div>
          <Button
            variant="secondary"
            onClick={() => dishes.append(emptyDish())}
            className="self-start"
          >
            <Icon name="plus" size={18} /> Add a dish or drink
          </Button>
        </Step>

        <Step n={4} title="Photos">
          <Controller
            control={control}
            name="photos"
            render={({ field }) => <PhotoPicker photos={field.value} onChange={field.onChange} />}
          />
        </Step>

        <Step n={5} title="Who can see it?">
          <Controller
            control={control}
            name="visibility"
            render={({ field }) => (
              <div role="radiogroup" aria-label="Visibility" className="flex flex-wrap gap-2">
                {VISIBILITY_OPTIONS.map((o) => (
                  <Chip
                    key={o.value}
                    role="radio"
                    aria-checked={field.value === o.value}
                    selected={field.value === o.value}
                    onClick={() => field.onChange(o.value)}
                  >
                    <Icon name={o.icon} size={16} /> {o.label}
                  </Chip>
                ))}
              </div>
            )}
          />
        </Step>

        <Step n={6} title="Anything else?">
          <TextArea
            label="Notes"
            placeholder="Vibe, parking tips, what you'd tell a friend…"
            error={errors.notes?.message}
            {...register('notes')}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Date"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              error={errors.date?.message}
              {...register('date')}
            />
            <Field
              label="Trip tag (optional)"
              placeholder="e.g. Nashville content trip"
              error={errors.tripTag?.message}
              {...register('tripTag')}
            />
          </div>
          <Controller
            control={control}
            name="isSponsored"
            render={({ field }) => (
              <Toggle
                label="Sponsored or gifted?"
                description="Paid, comped, or hosted by the restaurant or a brand"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {isSponsored && (
            <div className="flex flex-col gap-3">
              <Field
                label="Sponsor name"
                placeholder="Who is it with?"
                error={errors.sponsorName?.message}
                {...register('sponsorName')}
              />
              <DisclosureReminder />
            </div>
          )}
        </Step>

        <div className="border-line bg-bg/95 fixed inset-x-0 bottom-0 z-20 border-t p-4 backdrop-blur md:pl-[calc(15rem+1rem)]">
          <div className="mx-auto flex max-w-2xl flex-col gap-2">
            {submitError && (
              <p role="alert" className="text-danger text-center text-sm font-medium">
                {submitError}
              </p>
            )}
            {Object.keys(errors).length > 0 && (
              <p role="alert" className="text-danger text-center text-sm font-medium">
                Almost there. Check the highlighted fields.
              </p>
            )}
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Saving…' : 'Save visit'}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
