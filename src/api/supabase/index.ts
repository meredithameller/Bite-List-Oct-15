import type { Api } from '../types'
import { supabaseAuth } from './auth'
import {
  supabaseFeed,
  supabasePassport,
  supabasePlaces,
  supabaseProfile,
  supabaseQuests,
  supabaseVisits,
  supabaseWishlist,
} from './repositories'

export const supabaseApi: Api = {
  auth: supabaseAuth,
  visits: supabaseVisits,
  places: supabasePlaces,
  quests: supabaseQuests,
  feed: supabaseFeed,
  wishlist: supabaseWishlist,
  passport: supabasePassport,
  profile: supabaseProfile,
}
