import { describe, expect, it } from 'vitest'
import type { Place, QuestDefinition, VisitWithItems } from '@/api'
import { computeQuestProgress } from './quests'

const place = (id: string, over: Partial<Place> = {}): Place => ({
  id,
  name: id,
  city: 'Tampa',
  neighborhood: 'Ybor City',
  lat: 0,
  lng: 0,
  cuisines: ['Cuban'],
  priceTier: 1,
  isNewOpening: false,
  openedOn: '2020-01-01T00:00:00.000Z',
  ...over,
})

const visit = (
  id: string,
  placeId: string,
  date: string,
  dishNames: string[] = [],
): VisitWithItems => ({
  id,
  placeId,
  date,
  totalSpend: 20,
  worthIt: 'yes',
  visibility: 'private',
  tripTag: null,
  photos: [],
  isSponsored: false,
  sponsorName: null,
  notes: '',
  items: dishNames.map((name, i) => ({
    id: `${id}-${i}`,
    visitId: id,
    name,
    type: 'dish',
    price: null,
    rating: 5,
    orderAgain: false,
    note: '',
    photo: null,
  })),
})

const quest = (criteria: QuestDefinition['criteria']): QuestDefinition => ({
  id: 'q',
  title: 'Quest',
  description: '',
  city: 'Tampa',
  startsAt: '2026-10-01T00:00:00.000Z',
  endsAt: '2026-10-31T23:59:59.000Z',
  rules: [],
  rewardPoints: 50,
  badgeId: 'b',
  sponsorName: null,
  criteria,
})

const IN = '2026-10-08T12:00:00.000Z'
const places = [
  place('a'),
  place('b'),
  place('c', { neighborhood: 'Seminole Heights', isNewOpening: true }),
]

describe('quest progress', () => {
  const cuban = quest({ kind: 'dish-match', keywords: ['cuban'], target: 2 })

  it('starts at zero', () => {
    const p = computeQuestProgress(cuban, [], places)
    expect(p).toMatchObject({ current: 0, target: 2, percent: 0, completed: false })
  })

  it('counts a matching dish, case-insensitively', () => {
    const p = computeQuestProgress(cuban, [visit('v1', 'a', IN, ['Cuban Sandwich'])], places)
    expect(p).toMatchObject({ current: 1, percent: 50, completed: false })
    expect(p.qualifyingPlaceIds).toEqual(['a'])
  })

  it('counts distinct places, so repeat visits do not inflate progress', () => {
    const p = computeQuestProgress(
      cuban,
      [visit('v1', 'a', IN, ['cuban']), visit('v2', 'a', IN, ['cuban'])],
      places,
    )
    expect(p.current).toBe(1)
    expect(p.qualifyingVisitIds).toHaveLength(2)
  })

  it('completes and caps at the target', () => {
    const p = computeQuestProgress(
      cuban,
      [
        visit('v1', 'a', IN, ['cuban']),
        visit('v2', 'b', IN, ['cuban']),
        visit('v3', 'c', IN, ['cuban']),
      ],
      places,
    )
    expect(p).toMatchObject({ current: 2, percent: 100, completed: true })
  })

  it('ignores visits outside the quest window or in another city', () => {
    const early = visit('v1', 'a', '2026-09-01T12:00:00.000Z', ['cuban'])
    const nash = place('n', { city: 'Nashville' })
    const away = visit('v2', 'n', IN, ['cuban'])
    expect(computeQuestProgress(cuban, [early, away], [...places, nash]).current).toBe(0)
  })

  it('supports neighborhood and new-opening quests', () => {
    const hood = quest({ kind: 'neighborhood', neighborhood: 'seminole heights', target: 1 })
    expect(computeQuestProgress(hood, [visit('v1', 'c', IN)], places).completed).toBe(true)
    const fresh = quest({ kind: 'new-openings', target: 2 })
    expect(
      computeQuestProgress(fresh, [visit('v1', 'c', IN), visit('v2', 'a', IN)], places).current,
    ).toBe(1)
  })
})
