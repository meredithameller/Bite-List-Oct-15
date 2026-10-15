import { describe, expect, it } from 'vitest'
import type { FeedCard, Place, TasteProfile } from '@/api'
import { buildNextUp, limitSponsored, MAX_FEED_CARDS } from './feed'

const place = (id: string, cuisines: string[] = ['Cuban']): Place => ({
  id,
  name: id,
  city: 'Tampa',
  neighborhood: 'Ybor City',
  lat: 0,
  lng: 0,
  cuisines,
  priceTier: 2,
  isNewOpening: false,
  openedOn: '2024-01-01T00:00:00.000Z',
})

const card = (id: string, isSponsored = false, cuisines?: string[]): FeedCard => ({
  id,
  placeId: id,
  reason: 'because',
  isSponsored,
  questId: null,
  place: place(id, cuisines),
  quest: null,
})

const taste: TasteProfile = { cuisines: ['Cuban'], budgetTier: 2, dietaryNeeds: [] }

describe('single sponsored card rule', () => {
  it('keeps only the first sponsored item', () => {
    const out = limitSponsored([card('a', true), card('b'), card('c', true), card('d', true)])
    expect(out.filter((c) => c.isSponsored)).toHaveLength(1)
    expect(out.map((c) => c.id)).toEqual(['a', 'b'])
  })

  it('leaves a feed with no sponsored items untouched', () => {
    const items = [card('a'), card('b')]
    expect(limitSponsored(items)).toEqual(items)
  })

  it('buildNextUp never returns more than one sponsored card, even if sponsored cards rank highest', () => {
    const cards = [
      card('s1', true, ['Cuban']),
      card('s2', true, ['Cuban']),
      card('s3', true, ['Cuban']),
      card('o1', false, ['Thai']),
      card('o2', false, ['Thai']),
    ]
    const out = buildNextUp(cards, taste)
    expect(out.filter((c) => c.isSponsored)).toHaveLength(1)
    expect(out).toHaveLength(3)
  })

  it('caps the stack size', () => {
    const cards = Array.from({ length: 9 }, (_, i) => card(`o${i}`))
    expect(buildNextUp(cards, taste)).toHaveLength(MAX_FEED_CARDS)
  })

  it('ranks cuisines the user loves first', () => {
    const out = buildNextUp([card('thai', false, ['Thai']), card('cuban', false, ['Cuban'])], taste)
    expect(out[0]?.id).toBe('cuban')
  })
})
