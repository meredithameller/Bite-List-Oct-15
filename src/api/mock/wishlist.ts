import type { WishlistRepository, WishlistRow } from '../types'
import { commit, getState, simulate } from './db'

function toRow(state: ReturnType<typeof getState>, placeId: string): WishlistRow {
  const entry = state.wishlist.find((w) => w.placeId === placeId)
  const place = state.places.find((p) => p.id === placeId)
  if (!entry || !place) throw new Error('That wishlist entry could not be found.')
  return { ...entry, place }
}

export const mockWishlist: WishlistRepository = {
  list: () =>
    simulate(() => {
      const state = getState()
      return [...state.wishlist]
        .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
        .flatMap((w) => {
          const place = state.places.find((p) => p.id === w.placeId)
          return place ? [{ ...w, place }] : []
        })
    }),

  add: (entry) =>
    simulate(() => {
      const next = commit((s) => ({
        ...s,
        wishlist: [
          { ...entry, addedAt: new Date().toISOString() },
          ...s.wishlist.filter((w) => w.placeId !== entry.placeId),
        ],
      }))
      return toRow(next, entry.placeId)
    }),

  remove: (placeId) =>
    simulate(() => {
      commit((s) => ({ ...s, wishlist: s.wishlist.filter((w) => w.placeId !== placeId) }))
    }),
}
