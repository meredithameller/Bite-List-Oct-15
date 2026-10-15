import type { QuestsRepository } from '../types'
import { commit, getState, simulate } from './db'
import { buildQuests } from './shared'

export const mockQuests: QuestsRepository = {
  list: () => simulate(() => buildQuests(getState())),

  getById: (id) => simulate(() => buildQuests(getState()).find((q) => q.id === id) ?? null),

  start: (id) =>
    simulate(() => {
      const next = commit((s) =>
        s.startedQuestIds.includes(id) ? s : { ...s, startedQuestIds: [...s.startedQuestIds, id] },
      )
      const quest = buildQuests(next).find((q) => q.id === id)
      if (!quest) throw new Error('That quest could not be found.')
      return quest
    }),
}
