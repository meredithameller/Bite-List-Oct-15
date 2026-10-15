import type { NewVisit, VisitsRepository, VisitWithItems } from '../types'
import { commit, getState, newId, simulate } from './db'

const newestFirst = (a: VisitWithItems, b: VisitWithItems) => b.date.localeCompare(a.date)

export const mockVisits: VisitsRepository = {
  list: () => simulate(() => [...getState().visits].sort(newestFirst)),

  listByPlace: (placeId) =>
    simulate(() =>
      getState()
        .visits.filter((v) => v.placeId === placeId)
        .sort(newestFirst),
    ),

  create: (input: NewVisit) =>
    simulate(() => {
      const id = newId('v')
      const { items, ...rest } = input
      const visit: VisitWithItems = {
        ...rest,
        id,
        items: items.map((item, i) => ({ ...item, id: `${id}-i${i + 1}`, visitId: id })),
      }
      commit((s) => ({ ...s, visits: [visit, ...s.visits] }))
      return visit
    }),
}
