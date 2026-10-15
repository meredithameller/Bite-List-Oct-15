import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api, type City } from '@/api'
import { queryKeys } from './queryKeys'

export function usePlaces(filter?: { city?: City; query?: string }) {
  return useQuery({
    queryKey: queryKeys.places(filter),
    queryFn: () => api.places.list(filter),
    placeholderData: keepPreviousData,
  })
}

export function usePlace(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.place(id ?? ''),
    queryFn: () => api.places.getById(id ?? ''),
    enabled: !!id,
  })
}
