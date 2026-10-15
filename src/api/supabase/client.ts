import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** True when both env vars are set; otherwise the app falls back to the mock layer. */
export const isSupabaseConfigured = Boolean(url && key)

export type Client = SupabaseClient<Database>

let client: Client | null = null

export function getClient(): Client {
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }
  client ??= createClient<Database>(url, key)
  return client
}

/** The signed-in user's id, read from the locally stored session. */
export async function requireUserId(): Promise<string> {
  const { data, error } = await getClient().auth.getSession()
  if (error) throw new Error(error.message)
  const id = data.session?.user.id
  if (!id) throw new Error('You are signed out. Please sign in again.')
  return id
}

/** Throws a plain Error from a PostgREST error, otherwise returns the data. */
export function unwrap<T>(result: { data: T; error: { message: string } | null }): NonNullable<T> {
  if (result.error) throw new Error(result.error.message)
  if (result.data === null || result.data === undefined) throw new Error('No data came back.')
  return result.data
}
