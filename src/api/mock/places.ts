import type { PlacesRepository } from '../types'
import { getState, simulate } from './db'

export const mockPlaces: PlacesRepository = {
  list: (filter) =>
    simulate(() => {
      const query = filter?.query?.trim().toLowerCase()
      return getState()
        .places.filter((p) => !filter?.city || p.city === filter.city)
        .filter(
          (p) =>
            !query ||
            p.name.toLowerCase().includes(query) ||
            p.neighborhood.toLowerCase().includes(query) ||
            p.cuisines.some((c) => c.toLowerCase().includes(query)),
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    }),

  getById: (id) => simulate(() => getState().places.find((p) => p.id === id) ?? null),
}
