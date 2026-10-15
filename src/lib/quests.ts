import { isWithinInterval, parseISO } from 'date-fns'
import type { ID, Place, Quest, QuestDefinition, QuestProgress, VisitWithItems } from '@/api/types'

const norm = (s: string) => s.toLowerCase()

function visitQualifies(
  quest: QuestDefinition,
  visit: VisitWithItems,
  place: Place | undefined,
): boolean {
  if (!place || place.city !== quest.city) return false
  const when = parseISO(visit.date)
  if (!isWithinInterval(when, { start: parseISO(quest.startsAt), end: parseISO(quest.endsAt) })) {
    return false
  }
  const c = quest.criteria
  switch (c.kind) {
    case 'dish-match':
      return visit.items.some((item) => c.keywords.some((k) => norm(item.name).includes(norm(k))))
    case 'new-openings':
      return place.isNewOpening
    case 'neighborhood':
      return norm(place.neighborhood) === norm(c.neighborhood)
    case 'cuisine-variety':
      return true
  }
}

/**
 * Quests reward quality (a specific dish, a new opening, a neighborhood), so progress counts
 * distinct places (or cuisines), never repeat visits and never ratings.
 */
export function computeQuestProgress(
  quest: QuestDefinition,
  visits: VisitWithItems[],
  places: Place[],
): QuestProgress {
  const byId = new Map(places.map((p) => [p.id, p]))
  const qualifyingVisitIds: ID[] = []
  const qualifyingPlaceIds = new Set<ID>()
  const cuisines = new Set<string>()

  for (const visit of visits) {
    const place = byId.get(visit.placeId)
    if (!visitQualifies(quest, visit, place)) continue
    qualifyingVisitIds.push(visit.id)
    qualifyingPlaceIds.add(visit.placeId)
    place?.cuisines.forEach((c) => cuisines.add(norm(c)))
  }

  const target = quest.criteria.target
  const raw = quest.criteria.kind === 'cuisine-variety' ? cuisines.size : qualifyingPlaceIds.size
  const current = Math.min(raw, target)
  return {
    current,
    target,
    percent: target > 0 ? Math.round((current / target) * 100) : 0,
    completed: current >= target,
    qualifyingVisitIds,
    qualifyingPlaceIds: [...qualifyingPlaceIds],
  }
}

/** Places in the quest's city that could still count toward it. */
export function questCandidatePlaces(quest: QuestDefinition, places: Place[]): Place[] {
  const c = quest.criteria
  return places.filter((p) => {
    if (p.city !== quest.city) return false
    switch (c.kind) {
      case 'dish-match':
        return p.cuisines.some((cu) =>
          c.keywords.some((k) => norm(cu).includes(norm(k)) || norm(k).includes(norm(cu))),
        )
      case 'new-openings':
        return p.isNewOpening
      case 'neighborhood':
        return norm(p.neighborhood) === norm(c.neighborhood)
      case 'cuisine-variety':
        return true
    }
  })
}

/** Turns stored quest definitions into full Quests with computed progress. */
export function assembleQuests(
  defs: QuestDefinition[],
  visits: VisitWithItems[],
  places: Place[],
  startedQuestIds: ID[],
): Quest[] {
  return defs.map((def) => ({
    ...def,
    progress: computeQuestProgress(def, visits, places),
    started: startedQuestIds.includes(def.id),
    candidatePlaceIds: questCandidatePlaces(def, places).map((p) => p.id),
  }))
}
