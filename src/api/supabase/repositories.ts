import { composeFeed } from '@/lib/feed'
import { buildPassport } from '@/lib/rewards'
import { assembleQuests } from '@/lib/quests'
import { computeStats } from '@/lib/visits'
import type {
  FeedRepository,
  PassportRepository,
  PlacesRepository,
  ProfileRepository,
  Quest,
  QuestsRepository,
  VisitsRepository,
  WishlistRepository,
  WishlistRow,
} from '../types'
import { getClient, requireUserId, unwrap } from './client'
import {
  fetchBadges,
  fetchFeedItems,
  fetchPlaces,
  fetchQuestDefs,
  fetchStartedQuestIds,
  fetchVisits,
} from './data'
import { mapItem, mapPlace, mapProfile, mapVisit, mapWishlist } from './mappers'

async function loadQuests(): Promise<Quest[]> {
  const [defs, visits, places, started] = await Promise.all([
    fetchQuestDefs(),
    fetchVisits(),
    fetchPlaces(),
    fetchStartedQuestIds(),
  ])
  return assembleQuests(defs, visits, places, started)
}

async function loadProfile() {
  const result = await getClient().from('profiles').select('*').maybeSingle()
  if (result.error) throw new Error(result.error.message)
  if (!result.data) throw new Error('We could not find your profile. Try signing out and back in.')
  return mapProfile(result.data)
}

export const supabaseVisits: VisitsRepository = {
  list: () => fetchVisits({ withPhotos: true }),

  listByPlace: (placeId) => fetchVisits({ placeId, withPhotos: true }),

  create: async (input) => {
    const client = getClient()
    const { items, ...visit } = input
    const created = unwrap(
      await client
        .from('visits')
        .insert({
          place_id: visit.placeId,
          visited_at: visit.date,
          total_spend: visit.totalSpend,
          worth_it: visit.worthIt,
          visibility: visit.visibility,
          trip_tag: visit.tripTag,
          photos: visit.photos,
          is_sponsored: visit.isSponsored,
          sponsor_name: visit.sponsorName,
          notes: visit.notes,
        })
        .select(
          'id, place_id, visited_at, total_spend, worth_it, visibility, trip_tag, photos, is_sponsored, sponsor_name, notes',
        )
        .single(),
    )

    if (items.length === 0) return mapVisit(created, [])

    const inserted = await client
      .from('items')
      .insert(
        items.map((item, i) => ({
          visit_id: created.id,
          name: item.name,
          type: item.type,
          price: item.price,
          rating: item.rating,
          order_again: item.orderAgain,
          note: item.note,
          photo: item.photo,
          position: i,
        })),
      )
      .select(
        'id, visit_id, user_id, name, type, price, rating, order_again, note, photo, position',
      )
      .order('position')

    if (inserted.error) {
      // Don't leave a half-saved visit behind.
      await client.from('visits').delete().eq('id', created.id)
      throw new Error(inserted.error.message)
    }
    return mapVisit(created, inserted.data.map(mapItem))
  },
}

export const supabasePlaces: PlacesRepository = {
  list: async (filter) => {
    const query = filter?.query?.trim().toLowerCase()
    return (await fetchPlaces())
      .filter((p) => !filter?.city || p.city === filter.city)
      .filter(
        (p) =>
          !query ||
          p.name.toLowerCase().includes(query) ||
          p.neighborhood.toLowerCase().includes(query) ||
          p.cuisines.some((c) => c.toLowerCase().includes(query)),
      )
  },

  getById: async (id) => {
    const result = await getClient().from('places').select('*').eq('id', id).maybeSingle()
    if (result.error) throw new Error(result.error.message)
    return result.data ? mapPlace(result.data) : null
  },
}

export const supabaseQuests: QuestsRepository = {
  list: () => loadQuests(),

  getById: async (id) => (await loadQuests()).find((q) => q.id === id) ?? null,

  start: async (id) => {
    const result = await getClient().from('quest_starts').insert({ quest_id: id })
    // 23505 = already started; that's fine.
    if (result.error && result.error.code !== '23505') throw new Error(result.error.message)
    const quest = (await loadQuests()).find((q) => q.id === id)
    if (!quest) throw new Error('That quest could not be found.')
    return quest
  },
}

export const supabaseFeed: FeedRepository = {
  getNextUp: async (city) => {
    const client = getClient()
    const [feedItems, places, quests, visits, dismissals, profile] = await Promise.all([
      fetchFeedItems(),
      fetchPlaces(),
      loadQuests(),
      fetchVisits(),
      client.from('feed_dismissals').select('feed_item_id').then(unwrap),
      loadProfile(),
    ])
    return composeFeed({
      feedItems,
      places,
      quests,
      visitedPlaceIds: new Set(visits.map((v) => v.placeId)),
      dismissedFeedIds: new Set(dismissals.map((d) => d.feed_item_id)),
      taste: profile.tasteProfile,
      city,
    })
  },

  dismiss: async (feedItemId) => {
    const result = await getClient().from('feed_dismissals').insert({ feed_item_id: feedItemId })
    if (result.error && result.error.code !== '23505') throw new Error(result.error.message)
  },
}

async function wishlistRows(): Promise<WishlistRow[]> {
  const [rows, places] = await Promise.all([
    getClient().from('wishlist').select('*').order('added_at', { ascending: false }).then(unwrap),
    fetchPlaces(),
  ])
  return rows.flatMap((r) => {
    const place = places.find((p) => p.id === r.place_id)
    return place ? [{ ...mapWishlist(r), place }] : []
  })
}

export const supabaseWishlist: WishlistRepository = {
  list: wishlistRows,

  add: async (entry) => {
    const result = await getClient().from('wishlist').upsert(
      {
        place_id: entry.placeId,
        source: entry.source,
        note: entry.note,
        added_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,place_id' },
    )
    if (result.error) throw new Error(result.error.message)
    const row = (await wishlistRows()).find((r) => r.placeId === entry.placeId)
    if (!row) throw new Error('That wishlist entry could not be found.')
    return row
  },

  remove: async (placeId) => {
    const result = await getClient().from('wishlist').delete().eq('place_id', placeId)
    if (result.error) throw new Error(result.error.message)
  },
}

export const supabasePassport: PassportRepository = {
  get: async () => {
    const [visits, places, quests, badges] = await Promise.all([
      fetchVisits(),
      fetchPlaces(),
      loadQuests(),
      fetchBadges(),
    ])
    return buildPassport(visits, places, quests, badges)
  },
}

export const supabaseProfile: ProfileRepository = {
  getProfile: loadProfile,

  getStats: async () => {
    const [visits, places] = await Promise.all([fetchVisits(), fetchPlaces()])
    return computeStats(visits, places)
  },

  completeOnboarding: async (input) => {
    const userId = await requireUserId()
    const updated = unwrap(
      await getClient()
        .from('profiles')
        .update({
          home_city: input.homeCity,
          cuisines: input.cuisines,
          budget_tier: input.budgetTier,
          dietary_needs: input.dietaryNeeds,
          has_onboarded: true,
        })
        .eq('id', userId)
        .select('*')
        .single(),
    )
    return mapProfile(updated)
  },

  resetDemoData: async () => {
    const client = getClient()
    const userId = await requireUserId()
    // Deleting visits cascades to their items. RLS limits every delete to the signed-in user's rows.
    const results = await Promise.all([
      client.from('visits').delete().eq('user_id', userId),
      client.from('wishlist').delete().eq('user_id', userId),
      client.from('quest_starts').delete().eq('user_id', userId),
      client.from('feed_dismissals').delete().eq('user_id', userId),
      client.from('profiles').update({ has_onboarded: false }).eq('id', userId),
    ])
    const failed = results.find((r) => r.error)
    if (failed?.error) throw new Error(failed.error.message)
  },
}
