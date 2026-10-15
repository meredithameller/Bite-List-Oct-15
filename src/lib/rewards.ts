import { differenceInCalendarDays, parseISO } from 'date-fns'
import type {
  Badge,
  BadgeStatus,
  City,
  CityStamp,
  PassportData,
  Place,
  Quest,
  VisitWithItems,
} from '@/api/types'
import { CITIES } from './geo'

/**
 * Points reward the act of logging, never how highly something was rated.
 * (Rating is deliberately not an input to any function in this file.)
 */
export const POINTS = {
  visit: 10,
  newPlace: 10,
  withDishes: 5,
} as const

const byDateAsc = (a: VisitWithItems, b: VisitWithItems) =>
  parseISO(a.date).getTime() - parseISO(b.date).getTime()

export function computeVisitPoints(visits: VisitWithItems[]): number {
  const seenPlaces = new Set<string>()
  let total = 0
  for (const v of [...visits].sort(byDateAsc)) {
    total += POINTS.visit
    if (!seenPlaces.has(v.placeId)) total += POINTS.newPlace
    if (v.items.length > 0) total += POINTS.withDishes
    seenPlaces.add(v.placeId)
  }
  return total
}

/** Consecutive days with at least one log, ending today or yesterday. */
export function computeStreak(visits: VisitWithItems[], now = new Date()): number {
  const days = [...new Set(visits.map((v) => differenceInCalendarDays(now, parseISO(v.date))))]
    .filter((d) => d >= 0)
    .sort((a, b) => a - b)
  const first = days[0]
  if (first === undefined || first > 1) return 0
  let streak = 1
  for (let i = 1; i < days.length; i++) {
    if (days[i] === (days[i - 1] ?? 0) + 1) streak += 1
    else break
  }
  return streak
}

export function computeStamps(visits: VisitWithItems[], places: Place[]): CityStamp[] {
  const byId = new Map(places.map((p) => [p.id, p]))
  const stamps = new Map<City, { visits: number; places: Set<string>; first: string }>()
  for (const v of [...visits].sort(byDateAsc)) {
    const place = byId.get(v.placeId)
    if (!place) continue
    const s = stamps.get(place.city) ?? { visits: 0, places: new Set<string>(), first: v.date }
    s.visits += 1
    s.places.add(place.id)
    stamps.set(place.city, s)
  }
  return [...stamps.entries()].map(([city, s]) => ({
    city,
    visitCount: s.visits,
    placeCount: s.places.size,
    firstVisit: s.first,
  }))
}

interface MilestoneInput {
  visits: VisitWithItems[]
  stamps: CityStamp[]
  streak: number
}

const MILESTONES: Record<string, { hint: string; earned: (i: MilestoneInput) => boolean }> = {
  'first-bite': { hint: 'Log your first visit', earned: (i) => i.visits.length >= 1 },
  'streak-3': { hint: 'Log 3 days in a row', earned: (i) => i.streak >= 3 },
  'two-cities': { hint: 'Log visits in 2 cities', earned: (i) => i.stamps.length >= 2 },
  'transparent-taster': {
    hint: 'Log a sponsored visit with the sponsor named',
    earned: (i) => i.visits.some((v) => v.isSponsored && !!v.sponsorName),
  },
}

export function buildPassport(
  visits: VisitWithItems[],
  places: Place[],
  quests: Quest[],
  badges: Badge[],
  now = new Date(),
): PassportData {
  const stamps = computeStamps(visits, places)
  const streak = computeStreak(visits, now)
  const completed = quests.filter((q) => q.progress.completed)
  const input: MilestoneInput = { visits, stamps, streak }

  const badgeStatuses: BadgeStatus[] = badges.map((badge) => {
    const milestone = MILESTONES[badge.id]
    if (milestone) {
      return { badge, earned: milestone.earned(input), hint: milestone.hint }
    }
    const quest = quests.find((q) => q.badgeId === badge.id)
    return {
      badge,
      earned: !!quest?.progress.completed,
      hint: quest ? `Finish the quest: ${quest.title}` : 'Complete a quest',
    }
  })

  return {
    points: computeVisitPoints(visits) + completed.reduce((sum, q) => sum + q.rewardPoints, 0),
    streak,
    stamps,
    allCities: CITIES,
    badges: badgeStatuses,
  }
}
