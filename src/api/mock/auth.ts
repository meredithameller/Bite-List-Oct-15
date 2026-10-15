import type { AuthApi } from '../types'

/** The mock layer has one built-in user, so there is nothing to sign in to. */
export const mockAuth: AuthApi = {
  enabled: false,
  getSession: () => Promise.resolve({ userId: 'u1', email: 'demo@example.com' }),
  onChange: () => () => undefined,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve({ needsConfirmation: false }),
  signOut: () => Promise.resolve(),
}
