import type { Badge, FeedItem, Item, Place, QuestDefinition, VisitWithItems } from '../types'
import { getClient, unwrap } from './client'
import { mapItem, mapPlace, mapQuestDef, mapVisit, type VisitRow } from './mappers'

const ITEM_COLS =
  'id, visit_id, user_id, name, type, price, rating, order_again, note, photo, position'

function groupItems(items: Item[]): Map<string, Item[]> {
  const byVisit = new Map<string, Item[]>()
  for (const item of items) byVisit.set(item.visitId, [...(byVisit.get(item.visitId) ?? []), item])
  return byVisit
}

interface FetchVisitsOptions {
  placeId?: string
  withPhotos?: boolean
}

/** Visit rows, newest first. Photos are large, so they are only fetched when asked for. */
async function fetchVisitRows(
  placeId: string | undefined,
  withPhotos: boolean,
): Promise<VisitRow[]> {
  const client = getClient()
  if (withPhotos) {
    let q = client
      .from('visits')
      .select(
        'id, place_id, visited_at, total_spend, worth_it, visibility, trip_tag, is_sponsored, sponsor_name, notes, photos',
      )
      .order('visited_at', { ascending: false })
    if (placeId) q = q.eq('place_id', placeId)
    return unwrap(await q)
  }
  let q = client
    .from('visits')
    .select(
      'id, place_id, visited_at, total_spend, worth_it, visibility, trip_tag, is_sponsored, sponsor_name, notes',
    )
    .order('visited_at', { ascending: false })
  if (placeId) q = q.eq('place_id', placeId)
  return unwrap(await q)
}

/** The signed-in user's visits (RLS scopes the rows), newest first, with their items. */
export async function fetchVisits({
  placeId,
  withPhotos = false,
}: FetchVisitsOptions = {}): Promise<VisitWithItems[]> {
  const visitRows = await fetchVisitRows(placeId, withPhotos)
  if (visitRows.length === 0) return []

  const itemRows = unwrap(
    await getClient()
      .from('items')
      .select(ITEM_COLS)
      .in(
        'visit_id',
        visitRows.map((v) => v.id),
      )
      .order('position'),
  )
  const byVisit = groupItems(itemRows.map(mapItem))
  return visitRows.map((v) => mapVisit(v, byVisit.get(v.id) ?? []))
}

export async function fetchPlaces(): Promise<Place[]> {
  return unwrap(await getClient().from('places').select('*').order('name')).map(mapPlace)
}

export async function fetchQuestDefs(): Promise<QuestDefinition[]> {
  return unwrap(await getClient().from('quests').select('*').order('id')).map(mapQuestDef)
}

export async function fetchStartedQuestIds(): Promise<string[]> {
  return unwrap(await getClient().from('quest_starts').select('quest_id')).map((r) => r.quest_id)
}

export async function fetchBadges(): Promise<Badge[]> {
  return unwrap(await getClient().from('badges').select('*').order('id'))
}

export async function fetchFeedItems(): Promise<FeedItem[]> {
  return unwrap(await getClient().from('feed_items').select('*').order('id')).map((r) => ({
    id: r.id,
    placeId: r.place_id,
    reason: r.reason,
    isSponsored: r.is_sponsored,
    questId: r.quest_id,
  }))
}
