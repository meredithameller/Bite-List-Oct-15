import type { Session } from '@supabase/supabase-js'
import type { AuthApi, AuthSession } from '../types'
import { getClient } from './client'

const toSession = (s: Session | null): AuthSession | null =>
  s ? { userId: s.user.id, email: s.user.email ?? '' } : null

export const supabaseAuth: AuthApi = {
  enabled: true,

  getSession: async () => {
    const { data, error } = await getClient().auth.getSession()
    if (error) throw new Error(error.message)
    return toSession(data.session)
  },

  onChange: (listener) => {
    const { data } = getClient().auth.onAuthStateChange((_event, session) => {
      listener(toSession(session))
    })
    return () => data.subscription.unsubscribe()
  },

  signIn: async (email, password) => {
    const { error } = await getClient().auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  },

  signUp: async (email, password, name) => {
    const { data, error } = await getClient().auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw new Error(error.message)
    // With email confirmation on, there is no session until the link is clicked.
    return { needsConfirmation: data.session === null }
  },

  signOut: async () => {
    const { error } = await getClient().auth.signOut()
    if (error) throw new Error(error.message)
  },
}
