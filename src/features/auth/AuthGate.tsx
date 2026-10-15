import { Navigate, Outlet } from 'react-router-dom'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSession } from '@/hooks/useSession'

/** Everything except /login needs a signed-in user. */
export function AuthGate() {
  const state = useSession()
  if (state.status === 'loading') {
    return (
      <div role="status" aria-busy="true" className="mx-auto max-w-lg p-6">
        <span className="sr-only">Loading…</span>
        <Skeleton className="h-10 w-1/2" />
      </div>
    )
  }
  if (state.status === 'signedOut') return <Navigate to="/login" replace />
  return <Outlet />
}
