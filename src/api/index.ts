/**
 * THE swap point. Components and hooks import `api` from "@/api" and nothing else.
 *
 * - With VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY set, the app talks to Supabase.
 * - Without them it runs on the local mock layer (handy for offline dev and tests).
 */
import { mockAuth } from './mock/auth'
import { mockFeed } from './mock/feed'
import { mockPassport } from './mock/passport'
import { mockPlaces } from './mock/places'
import { mockProfile } from './mock/profile'
import { mockQuests } from './mock/quests'
import { mockVisits } from './mock/visits'
import { mockWishlist } from './mock/wishlist'
import { isSupabaseConfigured } from './supabase/client'
import { supabaseApi } from './supabase'
import type { Api } from './types'

const mockApi: Api = {
  auth: mockAuth,
  visits: mockVisits,
  places: mockPlaces,
  quests: mockQuests,
  feed: mockFeed,
  wishlist: mockWishlist,
  passport: mockPassport,
  profile: mockProfile,
}

export const api: Api = isSupabaseConfigured ? supabaseApi : mockApi

export * from './types'
