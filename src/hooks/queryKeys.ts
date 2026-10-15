export const queryKeys = {
  profile: ['profile'] as const,
  stats: ['profile', 'stats'] as const,
  places: (filter?: object) => ['places', filter ?? {}] as const,
  place: (id: string) => ['places', 'detail', id] as const,
  visits: ['visits'] as const,
  placeVisits: (id: string) => ['visits', 'place', id] as const,
  quests: ['quests'] as const,
  quest: (id: string) => ['quests', id] as const,
  feed: (city: string) => ['feed', city] as const,
  wishlist: ['wishlist'] as const,
  passport: ['passport'] as const,
}
