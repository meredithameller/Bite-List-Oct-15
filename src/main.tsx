import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { api } from '@/api'
import { APP_NAME } from '@/lib/config'
import { router } from '@/routes/router'
import '@/styles/index.css'

document.title = APP_NAME

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
})

// Cached data belongs to one user: drop it whenever someone signs in or out.
let currentUserId: string | null = null
api.auth.onChange((session) => {
  const nextUserId = session?.userId ?? null
  if (nextUserId !== currentUserId) {
    currentUserId = nextUserId
    queryClient.clear()
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
