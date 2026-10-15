import { composeFeed } from '@/lib/feed'
import type { FeedRepository } from '../types'
import { commit, getState, simulate } from './db'
import { buildQuests } from './shared'

export const mockFeed: FeedRepository = {
  getNextUp: (city) =>
    simulate(() => {
      const state = getState()
      return composeFeed({
        feedItems: state.feedItems,
        places: state.places,
        quests: buildQuests(state),
        visitedPlaceIds: new Set(state.visits.map((v) => v.placeId)),
        dismissedFeedIds: new Set(state.dismissedFeedIds),
        taste: state.user.tasteProfile,
        city,
      })
    }),

  dismiss: (feedItemId) =>
    simulate(() => {
      commit((s) =>
        s.dismissedFeedIds.includes(feedItemId)
          ? s
          : { ...s, dismissedFeedIds: [...s.dismissedFeedIds, feedItemId] },
      )
    }),
}
