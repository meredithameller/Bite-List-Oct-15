import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ErrorState } from './States'

interface QueryStateProps<T> {
  query: UseQueryResult<T>
  /** Skeleton shown while the first load is in flight. */
  loading: ReactNode
  /** Shown when the data is "empty" (isEmpty returns true). */
  empty?: ReactNode
  isEmpty?: (data: T) => boolean
  children: (data: T) => ReactNode
}

/** One place for the loading / error / empty / success switch used by every screen. */
export function QueryState<T>({ query, loading, empty, isEmpty, children }: QueryStateProps<T>) {
  if (query.isPending) {
    return (
      <div role="status" aria-live="polite" aria-busy="true">
        <span className="sr-only">Loading…</span>
        {loading}
      </div>
    )
  }
  if (query.isError) {
    return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />
  }
  if (empty && isEmpty?.(query.data)) return <>{empty}</>
  return <>{children(query.data)}</>
}
