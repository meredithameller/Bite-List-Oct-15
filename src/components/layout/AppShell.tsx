import { Navigate, Outlet } from 'react-router-dom'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/States'
import { useProfile } from '@/hooks/useProfile'
import { Sidebar } from './Sidebar'
import { TabBar } from './TabBar'

export function AppShell() {
  const profile = useProfile()

  // First run: send people through the taste quiz before showing the app.
  if (profile.data && !profile.data.hasOnboarded) return <Navigate to="/onboarding" replace />

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="bg-accent text-accent-ink sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Sidebar />
      <main id="main" className="md:pl-60">
        <div className="mx-auto w-full max-w-2xl px-4 pt-4 pb-28 md:px-8 md:pt-8 md:pb-12">
          {profile.isPending && (
            <div role="status" aria-busy="true" className="flex flex-col gap-4">
              <span className="sr-only">Loading…</span>
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-64 w-full" />
            </div>
          )}
          {profile.isError && (
            <ErrorState message={profile.error.message} onRetry={() => void profile.refetch()} />
          )}
          {profile.data && <Outlet />}
        </div>
      </main>
      <TabBar />
    </div>
  )
}
