import { describe, expect, it } from 'vitest'
import type { VisitWithItems } from '@/api'
import { computeStreak, computeVisitPoints, POINTS } from './rewards'

const visit = (
  id: string,
  placeId: string,
  date: string,
  rating = 5,
  items = 1,
): VisitWithItems => ({
  id,
  placeId,
  date,
  totalSpend: 10,
  worthIt: rating >= 4 ? 'yes' : 'no',
  visibility: 'private',
  tripTag: null,
  photos: [],
  isSponsored: false,
  sponsorName: null,
  notes: '',
  items: Array.from({ length: items }, (_, i) => ({
    id: `${id}-${i}`,
    visitId: id,
    name: 'x',
    type: 'dish' as const,
    price: null,
    rating,
    orderAgain: false,
    note: '',
    photo: null,
  })),
})

describe('rewards', () => {
  it('awards the same points whatever the rating (rewards are for logging)', () => {
    const loved = computeVisitPoints([visit('a', 'p1', '2026-10-08T12:00:00Z', 5)])
    const hated = computeVisitPoints([visit('a', 'p1', '2026-10-08T12:00:00Z', 1)])
    expect(loved).toBe(hated)
    expect(loved).toBe(POINTS.visit + POINTS.newPlace + POINTS.withDishes)
  })

  it('gives the new-place bonus only on the first visit to a place', () => {
    const total = computeVisitPoints([
      visit('a', 'p1', '2026-10-01T12:00:00Z', 4, 0),
      visit('b', 'p1', '2026-10-02T12:00:00Z', 4, 0),
    ])
    expect(total).toBe(POINTS.visit * 2 + POINTS.newPlace)
  })

  it('counts a streak of consecutive days ending today', () => {
    const now = new Date('2026-10-08T18:00:00')
    const vs = [
      visit('a', 'p1', new Date('2026-10-08T12:00:00').toISOString()),
      visit('b', 'p2', new Date('2026-10-07T12:00:00').toISOString()),
      visit('c', 'p3', new Date('2026-10-06T12:00:00').toISOString()),
      visit('d', 'p4', new Date('2026-10-03T12:00:00').toISOString()),
    ]
    expect(computeStreak(vs, now)).toBe(3)
  })

  it('resets the streak after a missed day', () => {
    const now = new Date('2026-10-08T18:00:00')
    expect(
      computeStreak([visit('a', 'p1', new Date('2026-10-05T12:00:00').toISOString())], now),
    ).toBe(0)
  })
})
