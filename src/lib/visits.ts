import type { Place, ProfileStats, VisitWithItems } from '@/api/types'

export interface UsualItem {
  name: string
  type: 'dish' | 'drink'
  times: number
  note: string
  photo: string | null
}

/** "My Usual Order": everything marked order-again, merged by name across visits. */
export function usualOrder(visits: VisitWithItems[]): UsualItem[] {
  const map = new Map<string, UsualItem>()
  const newestFirst = [...visits].sort((a, b) => b.date.localeCompare(a.date))
  for (const v of newestFirst) {
    for (const item of v.items) {
      if (!item.orderAgain) continue
      const key = item.name.trim().toLowerCase()
      const existing = map.get(key)
      if (existing) existing.times += 1
      else
        map.set(key, {
          name: item.name,
          type: item.type,
          times: 1,
          note: item.note,
          photo: item.photo,
        })
    }
  }
  return [...map.values()]
}

export function computeStats(visits: VisitWithItems[], places: Place[]): ProfileStats {
  const byId = new Map(places.map((p) => [p.id, p]))
  const placeIds = new Set(visits.map((v) => v.placeId))
  const cities = new Set<string>()
  const cuisineCounts = new Map<string, number>()
  for (const v of visits) {
    const place = byId.get(v.placeId)
    if (!place) continue
    cities.add(place.city)
    for (const c of place.cuisines) cuisineCounts.set(c, (cuisineCounts.get(c) ?? 0) + 1)
  }
  const sponsored = visits.filter((v) => v.isSponsored).length
  return {
    placesLogged: placeIds.size,
    visitsLogged: visits.length,
    citiesVisited: cities.size,
    topCuisines: [...cuisineCounts.entries()]
      .map(([cuisine, count]) => ({ cuisine, count }))
      .sort((a, b) => b.count - a.count || a.cuisine.localeCompare(b.cuisine))
      .slice(0, 5),
    sponsoredVisits: sponsored,
    organicVisits: visits.length - sponsored,
  }
}
