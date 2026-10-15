import { describe, expect, it } from 'vitest'
import {
  defaultLogValues,
  emptyDish,
  logFormSchema,
  toNewVisit,
  type LogFormValues,
} from './schema'

const valid = (over: Partial<LogFormValues> = {}): LogFormValues => ({
  ...defaultLogValues('p1'),
  ...over,
})

const messages = (values: LogFormValues) => {
  const r = logFormSchema.safeParse(values)
  return r.success ? [] : r.error.issues.map((i) => i.message)
}

describe('quick log validation', () => {
  it('accepts the simplest visit: just a place', () => {
    expect(logFormSchema.safeParse(valid()).success).toBe(true)
  })

  it('requires a place', () => {
    expect(messages(valid({ placeId: '' }))).toContain('Pick a place to log')
  })

  it('rejects bad or out-of-range spend', () => {
    expect(messages(valid({ totalSpend: 'abc' }))).toContain('Use an amount like 24 or 24.50')
    expect(messages(valid({ totalSpend: '-5' }))).toContain('Use an amount like 24 or 24.50')
    expect(messages(valid({ totalSpend: '99999' })).join()).toContain('Keep it under')
    expect(logFormSchema.safeParse(valid({ totalSpend: '24.50' })).success).toBe(true)
  })

  it('requires a name on any dish that was added', () => {
    expect(messages(valid({ dishes: [emptyDish()] }))).toContain('Name this dish or drink')
    expect(
      logFormSchema.safeParse(valid({ dishes: [{ ...emptyDish(), name: 'Birria tacos' }] }))
        .success,
    ).toBe(true)
  })

  it('keeps ratings between 1 and 5', () => {
    const dish = { ...emptyDish(), name: 'Soup' }
    expect(logFormSchema.safeParse(valid({ dishes: [{ ...dish, rating: 0 }] })).success).toBe(false)
    expect(logFormSchema.safeParse(valid({ dishes: [{ ...dish, rating: 6 }] })).success).toBe(false)
  })

  it('requires a sponsor name when the visit is sponsored', () => {
    expect(messages(valid({ isSponsored: true, sponsorName: '  ' }))).toContain(
      'Name the sponsor so your disclosure is clear',
    )
    expect(
      logFormSchema.safeParse(valid({ isSponsored: true, sponsorName: 'Acme Foods' })).success,
    ).toBe(true)
  })

  it('rejects dates in the future', () => {
    expect(messages(valid({ date: '2999-01-01' }))).toContain('That date is in the future')
  })
})

describe('toNewVisit', () => {
  it('converts strings to numbers and drops the sponsor when not sponsored', () => {
    const visit = toNewVisit(
      valid({
        totalSpend: '24.5',
        sponsorName: 'Leftover',
        isSponsored: false,
        dishes: [{ ...emptyDish(), name: ' Cuban ', price: '11' }],
      }),
    )
    expect(visit.totalSpend).toBe(24.5)
    expect(visit.sponsorName).toBeNull()
    expect(visit.items[0]).toMatchObject({ name: 'Cuban', price: 11 })
  })

  it('treats an empty spend as 0 and an empty price as null', () => {
    const visit = toNewVisit(valid({ dishes: [{ ...emptyDish(), name: 'Tea' }] }))
    expect(visit.totalSpend).toBe(0)
    expect(visit.items[0]?.price).toBeNull()
  })
})
