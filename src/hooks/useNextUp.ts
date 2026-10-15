import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type FeedCard } from '@/api'
import { distanceFromCity } from '@/lib/geo'
import { queryKeys } from './queryKeys'
import { useCurrentCity } from './useProfile'

export type FeedCardWithDistance = FeedCard & { distanceKm: number }

export function useNextUp() {
  const city = useCurrentCity()
  return useQuery({
    queryKey: queryKeys.feed(city),
    queryFn: () => api.feed.getNextUp(city),
    select: (cards): FeedCardWithDistance[] =>
      cards.map((c) => ({ ...c, distanceKm: distanceFromCity(city, c.place) })),
  })
}

export function useDismissFeedItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.feed.dismiss(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feed'] }),
  })
}
