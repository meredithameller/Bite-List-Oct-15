import { assembleQuests } from '@/lib/quests'
import type { Quest } from '../types'
import type { DbState } from './seed'

/** Turns stored quest definitions into full Quests with computed progress. */
export function buildQuests(state: DbState): Quest[] {
  return assembleQuests(state.questDefs, state.visits, state.places, state.startedQuestIds)
}
