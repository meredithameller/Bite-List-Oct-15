import { useEffect, useState } from 'react'
import { api, type AuthSession } from '@/api'

export type SessionState =
  { status: 'loading' } | { status: 'signedOut' } | { status: 'signedIn'; session: AuthSession }

/** Tracks the auth session. With the mock layer this is always "signed in". */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    const apply = (session: AuthSession | null) => {
      if (active) setState(session ? { status: 'signedIn', session } : { status: 'signedOut' })
    }
    api.auth.getSession().then(apply, () => apply(null))
    const unsubscribe = api.auth.onChange(apply)
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return state
}
