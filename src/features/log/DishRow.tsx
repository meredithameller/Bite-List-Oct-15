import { Controller, useFormContext } from 'react-hook-form'
import { Chip } from '@/components/ui/Chip'
import { Field } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { StarInput } from '@/components/ui/Stars'
import { Toggle } from '@/components/ui/Toggle'
import type { LogFormValues } from './schema'

interface DishRowProps {
  index: number
  onRemove: () => void
}

export function DishRow({ index, onRemove }: DishRowProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<LogFormValues>()
  const e = errors.dishes?.[index]
  const n = index + 1

  return (
    <fieldset className="border-line bg-surface flex flex-col gap-3 rounded-2xl border p-4">
      <legend className="sr-only">Item {n}</legend>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Field
            label={`Item ${n} name`}
            placeholder="What did you order?"
            error={e?.name?.message}
            {...register(`dishes.${index}.name`)}
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove item ${n}`}
          className="text-muted hover:bg-surface-2 mt-7 flex size-11 items-center justify-center rounded-full"
        >
          <Icon name="trash" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Controller
          control={control}
          name={`dishes.${index}.type`}
          render={({ field }) => (
            <>
              <Chip selected={field.value === 'dish'} onClick={() => field.onChange('dish')}>
                🍽️ Dish
              </Chip>
              <Chip selected={field.value === 'drink'} onClick={() => field.onChange('drink')}>
                🥤 Drink
              </Chip>
            </>
          )}
        />
        <div className="w-28">
          <Field
            label={`Item ${n} price`}
            hideLabel
            inputMode="decimal"
            placeholder="Price $"
            error={e?.price?.message}
            {...register(`dishes.${index}.price`)}
          />
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-semibold">Rating</p>
        <Controller
          control={control}
          name={`dishes.${index}.rating`}
          render={({ field }) => (
            <StarInput label={`Item ${n} rating`} value={field.value} onChange={field.onChange} />
          )}
        />
        {e?.rating?.message && (
          <p role="alert" className="text-danger text-sm">
            {e.rating.message}
          </p>
        )}
      </div>

      <Controller
        control={control}
        name={`dishes.${index}.orderAgain`}
        render={({ field }) => (
          <Toggle
            label="Order again 🔁"
            description="Adds it to your usual order for this place"
            checked={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Field
        label={`Item ${n} note`}
        hideLabel
        placeholder="Quick note (optional)"
        error={e?.note?.message}
        {...register(`dishes.${index}.note`)}
      />
    </fieldset>
  )
}
