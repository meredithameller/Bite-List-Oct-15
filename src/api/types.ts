/**
 * Domain types and repository contracts.
 * Everything the UI knows about data lives here. The mock layer implements these
 * interfaces today; a Supabase layer can implement the same ones later.
 */

export type ID = string
export type City = 'Tampa' | 'Nashville'
export type PriceTier = 1 | 2 | 3 | 4
export type WorthIt = 'yes' | 'meh' | 'no'
export type Visibility = 'private' | 'friends' | 'public'
export type ItemType = 'dish' | 'drink'
export type WishlistSource = 'friend' | 'social' | 'press' | 'other'

export interface TasteProfile {
  cuisines: string[]
  budgetTier: PriceTier
  dietaryNeeds: string[]
}

export interface User {
  id: ID
  name: string
  handle: string
  avatarUrl: string
  homeCity: City
  tasteProfile: TasteProfile
  isCreator: boolean
  /** Added beyond the brief: drives the first-run onboarding redirect. */
  hasOnboarded: boolean
}

export interface Place {
  id: ID
  name: string
  city: City
  neighborhood: string
  lat: number
  lng: number
  cuisines: string[]
  priceTier: PriceTier
  isNewOpening: boolean
  /** ISO date */
  openedOn: string
}

export interface Visit {
  id: ID
  placeId: ID
  /** ISO date-time */
  date: string
  totalSpend: number
  worthIt: WorthIt
  visibility: Visibility
  tripTag: string | null
  /** Data URLs, or "art:<seed>" placeholders (see lib/image.ts). */
  photos: string[]
  isSponsored: boolean
  sponsorName: string | null
  notes: string
}

/** A dish or a drink ordered during a visit. */
export interface Item {
  id: ID
  visitId: ID
  name: string
  type: ItemType
  price: number | null
  /** 1-5 */
  rating: number
  orderAgain: boolean
  note: string
  photo: string | null
}

export type VisitWithItems = Visit & { items: Item[] }

export type NewItem = Omit<Item, 'id' | 'visitId'>
export type NewVisit = Omit<Visit, 'id'> & { items: NewItem[] }

export interface Badge {
  id: ID
  name: string
  /** Emoji */
  icon: string
  description: string
}
export type Reward = Badge

export type QuestCriteria =
  | { kind: 'dish-match'; keywords: string[]; target: number }
  | { kind: 'new-openings'; target: number }
  | { kind: 'neighborhood'; neighborhood: string; target: number }
  | { kind: 'cuisine-variety'; target: number }

/** What is stored for a quest, before progress is worked out. */
export interface QuestDefinition {
  id: ID
  title: string
  description: string
  city: City
  /** ISO date-time */
  startsAt: string
  endsAt: string
  rules: string[]
  rewardPoints: number
  badgeId: ID
  sponsorName: string | null
  criteria: QuestCriteria
}

export interface QuestProgress {
  current: number
  target: number
  /** 0-100 */
  percent: number
  completed: boolean
  qualifyingVisitIds: ID[]
  qualifyingPlaceIds: ID[]
}

export interface Quest extends QuestDefinition {
  progress: QuestProgress
  /** Has the user tapped "Start Quest"? */
  started: boolean
  /** Places that could count toward this quest (to explore). */
  candidatePlaceIds: ID[]
}

export interface FeedItem {
  id: ID
  placeId: ID
  /** Why this pick was made, shown on the card. */
  reason: string
  isSponsored: boolean
  questId: ID | null
}

export interface FeedCard extends FeedItem {
  place: Place
  quest: Quest | null
}

export interface WishlistEntry {
  placeId: ID
  source: WishlistSource
  note: string
  /** ISO date-time */
  addedAt: string
}

export interface WishlistRow extends WishlistEntry {
  place: Place
}

export interface CityStamp {
  city: City
  visitCount: number
  placeCount: number
  firstVisit: string
}

export interface BadgeStatus {
  badge: Badge
  earned: boolean
  /** Short hint on how to earn it. */
  hint: string
}

export interface PassportData {
  points: number
  streak: number
  stamps: CityStamp[]
  allCities: City[]
  badges: BadgeStatus[]
}

export interface ProfileStats {
  placesLogged: number
  visitsLogged: number
  citiesVisited: number
  topCuisines: { cuisine: string; count: number }[]
  sponsoredVisits: number
  organicVisits: number
}

export interface OnboardingInput {
  cuisines: string[]
  budgetTier: PriceTier
  dietaryNeeds: string[]
  homeCity: City
}

// ---------------------------------------------------------------- repositories

export interface VisitsRepository {
  list(): Promise<VisitWithItems[]>
  listByPlace(placeId: ID): Promise<VisitWithItems[]>
  create(input: NewVisit): Promise<VisitWithItems>
}

export interface PlacesRepository {
  list(filter?: { city?: City; query?: string }): Promise<Place[]>
  getById(id: ID): Promise<Place | null>
}

export interface QuestsRepository {
  list(): Promise<Quest[]>
  getById(id: ID): Promise<Quest | null>
  start(id: ID): Promise<Quest>
}

export interface FeedRepository {
  getNextUp(city: City): Promise<FeedCard[]>
  dismiss(feedItemId: ID): Promise<void>
}

export interface WishlistRepository {
  list(): Promise<WishlistRow[]>
  add(entry: Omit<WishlistEntry, 'addedAt'>): Promise<WishlistRow>
  remove(placeId: ID): Promise<void>
}

export interface PassportRepository {
  get(): Promise<PassportData>
}

export interface ProfileRepository {
  getProfile(): Promise<User>
  getStats(): Promise<ProfileStats>
  completeOnboarding(input: OnboardingInput): Promise<User>
  /** Puts the app back into first-run state with the seed data. */
  resetDemoData(): Promise<void>
}

export interface AuthSession {
  userId: string
  email: string
}

export interface AuthApi {
  /** False for the mock layer, which has a single built-in user and no login. */
  enabled: boolean
  getSession(): Promise<AuthSession | null>
  /** Subscribe to sign-in / sign-out. Returns an unsubscribe function. */
  onChange(listener: (session: AuthSession | null) => void): () => void
  signIn(email: string, password: string): Promise<void>
  signUp(email: string, password: string, name: string): Promise<{ needsConfirmation: boolean }>
  signOut(): Promise<void>
}

export interface Api {
  auth: AuthApi
  visits: VisitsRepository
  places: PlacesRepository
  quests: QuestsRepository
  feed: FeedRepository
  wishlist: WishlistRepository
  passport: PassportRepository
  profile: ProfileRepository
}
