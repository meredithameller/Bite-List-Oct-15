import type { City, FeedCard, FeedItem, Place, Quest, TasteProfile } from '@/api/types'

export const MAX_FEED_CARDS = 5
export const MAX_SPONSORED_CARDS = 1

/** Keeps the first `max` sponsored items and drops the rest. Order is preserved. */
export function limitSponsored<T extends { isSponsored: boolean }>(
  items: T[],
  max = MAX_SPONSORED_CARDS,
): T[] {
  let seen = 0
  return items.filter((item) => {
    if (!item.isSponsored) return true
    seen += 1
    return seen <= max
  })
}

function score(card: FeedCard, taste: TasteProfile): number {
  const overlap = card.place.cuisines.filter((c) =>
    taste.cuisines.some((t) => t.toLowerCase() === c.toLowerCase()),
  ).length
  const budgetFit = card.place.priceTier <= taste.budgetTier + 1 ? 1 : 0
  return overlap * 3 + (card.place.isNewOpening ? 1 : 0) + budgetFit + (card.quest ? 1 : 0)
}

/** Ranks by taste fit, enforces the single-sponsored rule, and caps the stack size. */
export function buildNextUp(cards: FeedCard[], taste: TasteProfile): FeedCard[] {
  const ranked = [...cards].sort((a, b) => score(b, taste) - score(a, taste))
  return limitSponsored(ranked).slice(0, MAX_FEED_CARDS)
}

interface ComposeFeedInput {
  feedItems: FeedItem[]
  places: Place[]
  quests: Quest[]
  visitedPlaceIds: Set<string>
  dismissedFeedIds: Set<string>
  taste: TasteProfile
  city: City
}

/** Joins feed items with their place and quest, drops visited/dismissed picks, then ranks. */
export function composeFeed(input: ComposeFeedInput): FeedCard[] {
  const { feedItems, places, quests, visitedPlaceIds, dismissedFeedIds, taste, city } = input
  const cards: FeedCard[] = []
  for (const item of feedItems) {
    if (dismissedFeedIds.has(item.id)) continue
    const place = places.find((p) => p.id === item.placeId)
    if (!place || place.city !== city || visitedPlaceIds.has(place.id)) continue
    const quest = item.questId ? (quests.find((q) => q.id === item.questId) ?? null) : null
    cards.push({ ...item, place, quest })
  }
  return buildNextUp(cards, taste)
}
