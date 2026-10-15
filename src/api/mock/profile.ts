import { computeStats } from '@/lib/visits'
import type { ProfileRepository } from '../types'
import { commit, getState, resetState, simulate } from './db'

export const mockProfile: ProfileRepository = {
  getProfile: () => simulate(() => getState().user),

  getStats: () =>
    simulate(() => {
      const s = getState()
      return computeStats(s.visits, s.places)
    }),

  completeOnboarding: (input) =>
    simulate(() => {
      const next = commit((s) => ({
        ...s,
        user: {
          ...s.user,
          homeCity: input.homeCity,
          hasOnboarded: true,
          tasteProfile: {
            cuisines: input.cuisines,
            budgetTier: input.budgetTier,
            dietaryNeeds: input.dietaryNeeds,
          },
        },
      }))
      return next.user
    }),

  resetDemoData: () =>
    simulate(() => {
      resetState()
      // Demo reset means first-run again.
      commit((s) => ({ ...s, user: { ...s.user, hasOnboarded: false } }))
    }),
}
