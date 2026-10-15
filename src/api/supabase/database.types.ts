/** Generated from the Supabase schema (supabase/migrations). Regenerate after schema changes. */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.18' }
  public: {
    Tables: {
      badges: {
        Row: { description: string; icon: string; id: string; name: string }
        Insert: { description: string; icon: string; id: string; name: string }
        Update: { description?: string; icon?: string; id?: string; name?: string }
        Relationships: []
      }
      feed_dismissals: {
        Row: { dismissed_at: string; feed_item_id: string; user_id: string }
        Insert: { dismissed_at?: string; feed_item_id: string; user_id?: string }
        Update: { dismissed_at?: string; feed_item_id?: string; user_id?: string }
        Relationships: []
      }
      feed_items: {
        Row: {
          id: string
          is_sponsored: boolean
          place_id: string
          quest_id: string | null
          reason: string
        }
        Insert: {
          id: string
          is_sponsored?: boolean
          place_id: string
          quest_id?: string | null
          reason: string
        }
        Update: {
          id?: string
          is_sponsored?: boolean
          place_id?: string
          quest_id?: string | null
          reason?: string
        }
        Relationships: []
      }
      items: {
        Row: {
          id: string
          name: string
          note: string
          order_again: boolean
          photo: string | null
          position: number
          price: number | null
          rating: number
          type: string
          user_id: string
          visit_id: string
        }
        Insert: {
          id?: string
          name: string
          note?: string
          order_again?: boolean
          photo?: string | null
          position?: number
          price?: number | null
          rating: number
          type: string
          user_id?: string
          visit_id: string
        }
        Update: {
          id?: string
          name?: string
          note?: string
          order_again?: boolean
          photo?: string | null
          position?: number
          price?: number | null
          rating?: number
          type?: string
          user_id?: string
          visit_id?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          city: string
          cuisines: string[]
          id: string
          is_new_opening: boolean
          lat: number
          lng: number
          name: string
          neighborhood: string
          opened_on: string
          price_tier: number
        }
        Insert: {
          city: string
          cuisines?: string[]
          id: string
          is_new_opening?: boolean
          lat: number
          lng: number
          name: string
          neighborhood: string
          opened_on: string
          price_tier: number
        }
        Update: {
          city?: string
          cuisines?: string[]
          id?: string
          is_new_opening?: boolean
          lat?: number
          lng?: number
          name?: string
          neighborhood?: string
          opened_on?: string
          price_tier?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          budget_tier: number
          created_at: string
          cuisines: string[]
          dietary_needs: string[]
          handle: string
          has_onboarded: boolean
          home_city: string
          id: string
          is_creator: boolean
          name: string
        }
        Insert: {
          avatar_url?: string
          budget_tier?: number
          created_at?: string
          cuisines?: string[]
          dietary_needs?: string[]
          handle: string
          has_onboarded?: boolean
          home_city?: string
          id: string
          is_creator?: boolean
          name: string
        }
        Update: {
          avatar_url?: string
          budget_tier?: number
          created_at?: string
          cuisines?: string[]
          dietary_needs?: string[]
          handle?: string
          has_onboarded?: boolean
          home_city?: string
          id?: string
          is_creator?: boolean
          name?: string
        }
        Relationships: []
      }
      quest_starts: {
        Row: { quest_id: string; started_at: string; user_id: string }
        Insert: { quest_id: string; started_at?: string; user_id?: string }
        Update: { quest_id?: string; started_at?: string; user_id?: string }
        Relationships: []
      }
      quests: {
        Row: {
          badge_id: string
          city: string
          criteria: Json
          description: string
          ends_at: string
          id: string
          reward_points: number
          rules: string[]
          sponsor_name: string | null
          starts_at: string
          title: string
        }
        Insert: {
          badge_id: string
          city: string
          criteria: Json
          description: string
          ends_at: string
          id: string
          reward_points: number
          rules?: string[]
          sponsor_name?: string | null
          starts_at: string
          title: string
        }
        Update: {
          badge_id?: string
          city?: string
          criteria?: Json
          description?: string
          ends_at?: string
          id?: string
          reward_points?: number
          rules?: string[]
          sponsor_name?: string | null
          starts_at?: string
          title?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          id: string
          is_sponsored: boolean
          notes: string
          photos: string[]
          place_id: string
          sponsor_name: string | null
          total_spend: number
          trip_tag: string | null
          user_id: string
          visibility: string
          visited_at: string
          worth_it: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_sponsored?: boolean
          notes?: string
          photos?: string[]
          place_id: string
          sponsor_name?: string | null
          total_spend?: number
          trip_tag?: string | null
          user_id?: string
          visibility?: string
          visited_at?: string
          worth_it: string
        }
        Update: {
          created_at?: string
          id?: string
          is_sponsored?: boolean
          notes?: string
          photos?: string[]
          place_id?: string
          sponsor_name?: string | null
          total_spend?: number
          trip_tag?: string | null
          user_id?: string
          visibility?: string
          visited_at?: string
          worth_it?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: { added_at: string; note: string; place_id: string; source: string; user_id: string }
        Insert: {
          added_at?: string
          note?: string
          place_id: string
          source: string
          user_id?: string
        }
        Update: {
          added_at?: string
          note?: string
          place_id?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
