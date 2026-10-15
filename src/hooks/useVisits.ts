import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type NewVisit } from '@/api'
import { queryKeys } from './queryKeys'

export function useVisits() {
  return useQuery({ queryKey: queryKeys.visits, queryFn: () => api.visits.list() })
}

export function usePlaceVisits(placeId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.placeVisits(placeId ?? ''),
    queryFn: () => api.visits.listByPlace(placeId ?? ''),
    enabled: !!placeId,
  })
}

export function useCreateVisit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: NewVisit) => api.visits.create(input),
    // A new log changes visits, quest progress, rewards, stats and what the feed suggests.
    onSuccess: () => {
      void qc.invalidateQueries()
    },
  })
}
