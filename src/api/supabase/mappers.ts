import { z } from 'zod'
import type {
  City,
  Item,
  ItemType,
  Place,
  PriceTier,
  QuestCriteria,
  QuestDefinition,
  User,
  Visibility,
  VisitWithItems,
  WishlistEntry,
  WishlistSource,
  WorthIt,
} from '../types'
import type { Database } from './database.types'

type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

/** Narrow a DB string to a known union, failing loudly if the data is unexpected. */
function oneOf<T extends string>(value: string, allowed: readonly T[], label: string): T {
  const match = allowed.find((a) => a === value)
  if (!match) throw new Error(`Unexpected ${label} "${value}" in the database.`)
  return match
}

const CITIES = ['Tampa', 'Nashville'] as const satisfies readonly City[]
const TIERS = [1, 2, 3, 4] as const satisfies readonly PriceTier[]
const tier = (n: number): PriceTier => {
  const match = TIERS.find((t) => t === n)
  if (!match) throw new Error(`Unexpected price tier ${n} in the database.`)
  return match
}

export const asCity = (s: string): City => oneOf(s, CITIES, 'city')

export function mapPlace(r: Row<'places'>): Place {
  return {
    id: r.id,
    name: r.name,
    city: asCity(r.city),
    neighborhood: r.neighborhood,
    lat: r.lat,
    lng: r.lng,
    cuisines: r.cuisines,
    priceTier: tier(r.price_tier),
    isNewOpening: r.is_new_opening,
    openedOn: r.opened_on,
  }
}

export function mapItem(r: Row<'items'>): Item {
  return {
    id: r.id,
    visitId: r.visit_id,
    name: r.name,
    type: oneOf<ItemType>(r.type, ['dish', 'drink'], 'item type'),
    price: r.price,
    rating: r.rating,
    orderAgain: r.order_again,
    note: r.note,
    photo: r.photo,
  }
}

export type VisitRow = Omit<Row<'visits'>, 'photos' | 'user_id' | 'created_at'> & {
  photos?: string[]
}

export function mapVisit(r: VisitRow, items: Item[]): VisitWithItems {
  return {
    id: r.id,
    placeId: r.place_id,
    date: r.visited_at,
    totalSpend: r.total_spend,
    worthIt: oneOf<WorthIt>(r.worth_it, ['yes', 'meh', 'no'], 'worth-it value'),
    visibility: oneOf<Visibility>(r.visibility, ['private', 'friends', 'public'], 'visibility'),
    tripTag: r.trip_tag,
    photos: r.photos ?? [],
    isSponsored: r.is_sponsored,
    sponsorName: r.sponsor_name,
    notes: r.notes,
    items,
  }
}

const criteriaSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('dish-match'), keywords: z.array(z.string()), target: z.number() }),
  z.object({ kind: z.literal('new-openings'), target: z.number() }),
  z.object({ kind: z.literal('neighborhood'), neighborhood: z.string(), target: z.number() }),
  z.object({ kind: z.literal('cuisine-variety'), target: z.number() }),
])

export function mapQuestDef(r: Row<'quests'>): QuestDefinition {
  const criteria: QuestCriteria = criteriaSchema.parse(r.criteria)
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    city: asCity(r.city),
    startsAt: r.starts_at,
    endsAt: r.ends_at,
    rules: r.rules,
    rewardPoints: r.reward_points,
    badgeId: r.badge_id,
    sponsorName: r.sponsor_name,
    criteria,
  }
}

export function mapProfile(r: Row<'profiles'>): User {
  return {
    id: r.id,
    name: r.name,
    handle: r.handle,
    avatarUrl: r.avatar_url || `art:${r.id}|🧑‍🍳`,
    homeCity: asCity(r.home_city),
    tasteProfile: {
      cuisines: r.cuisines,
      budgetTier: tier(r.budget_tier),
      dietaryNeeds: r.dietary_needs,
    },
    isCreator: r.is_creator,
    hasOnboarded: r.has_onboarded,
  }
}

export function mapWishlist(r: Row<'wishlist'>): WishlistEntry {
  return {
    placeId: r.place_id,
    source: oneOf<WishlistSource>(
      r.source,
      ['friend', 'social', 'press', 'other'],
      'wishlist source',
    ),
    note: r.note,
    addedAt: r.added_at,
  }
}
