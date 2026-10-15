import { z } from 'zod'
import type { NewVisit } from '@/api'

export const MAX_PHOTOS = 4
export const MAX_SPEND = 10_000

const moneyString = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\d+(\.\d{1,2})?$/.test(v), 'Use an amount like 24 or 24.50')
  .refine((v) => v === '' || Number(v) <= MAX_SPEND, `Keep it under $${MAX_SPEND.toLocaleString()}`)

export const dishSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name this dish or drink')
    .max(80, 'Keep the name under 80 characters'),
  type: z.enum(['dish', 'drink']),
  price: moneyString,
  rating: z.number().int().min(1, 'Pick a rating').max(5),
  orderAgain: z.boolean(),
  note: z.string().max(200, 'Keep the note under 200 characters'),
})

const todayString = () => new Date().toISOString().slice(0, 10)

export const logFormSchema = z
  .object({
    placeId: z.string().min(1, 'Pick a place to log'),
    date: z
      .string()
      .min(1, 'Pick a date')
      .refine((d) => d <= todayString(), 'That date is in the future'),
    photos: z.array(z.string()).max(MAX_PHOTOS, `Up to ${MAX_PHOTOS} photos`),
    dishes: z.array(dishSchema),
    worthIt: z.enum(['yes', 'meh', 'no']),
    totalSpend: moneyString,
    notes: z.string().max(500, 'Keep notes under 500 characters'),
    tripTag: z.string().trim().max(60),
    visibility: z.enum(['private', 'friends', 'public']),
    isSponsored: z.boolean(),
    sponsorName: z.string().trim().max(80),
  })
  .superRefine((v, ctx) => {
    if (v.isSponsored && v.sponsorName.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['sponsorName'],
        message: 'Name the sponsor so your disclosure is clear',
      })
    }
  })

export type LogFormValues = z.infer<typeof logFormSchema>
export type DishValues = z.infer<typeof dishSchema>

export const emptyDish = (): DishValues => ({
  name: '',
  type: 'dish',
  price: '',
  rating: 4,
  orderAgain: false,
  note: '',
})

export const defaultLogValues = (placeId = ''): LogFormValues => ({
  placeId,
  date: todayString(),
  photos: [],
  dishes: [],
  worthIt: 'yes',
  totalSpend: '',
  notes: '',
  tripTag: '',
  visibility: 'friends',
  isSponsored: false,
  sponsorName: '',
})

/** Has the user typed anything worth restoring? */
export const hasDraftContent = (v: LogFormValues) =>
  v.placeId !== '' ||
  v.photos.length > 0 ||
  v.dishes.length > 0 ||
  v.totalSpend !== '' ||
  v.notes !== ''

export function toNewVisit(v: LogFormValues): NewVisit {
  const isToday = v.date === todayString()
  const when = isToday ? new Date() : new Date(`${v.date}T12:00:00`)
  return {
    placeId: v.placeId,
    date: when.toISOString(),
    totalSpend: v.totalSpend === '' ? 0 : Number(v.totalSpend),
    worthIt: v.worthIt,
    visibility: v.visibility,
    tripTag: v.tripTag.trim() === '' ? null : v.tripTag.trim(),
    photos: v.photos,
    isSponsored: v.isSponsored,
    sponsorName: v.isSponsored ? v.sponsorName.trim() : null,
    notes: v.notes.trim(),
    items: v.dishes.map((d) => ({
      name: d.name.trim(),
      type: d.type,
      price: d.price === '' ? null : Number(d.price),
      rating: d.rating,
      orderAgain: d.orderAgain,
      note: d.note.trim(),
      photo: null,
    })),
  }
}
