import { buildPassport } from '@/lib/rewards'
import type { PassportRepository } from '../types'
import { getState, simulate } from './db'
import { buildQuests } from './shared'

export const mockPassport: PassportRepository = {
  get: () =>
    simulate(() => {
      const s = getState()
      return buildPassport(s.visits, s.places, buildQuests(s), s.badges)
    }),
}
