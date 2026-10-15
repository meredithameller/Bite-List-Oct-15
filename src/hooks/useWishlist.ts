import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type WishlistEntry } from '@/api'
import { queryKeys } from './queryKeys'

export function useWishlist() {
  return useQuery({ queryKey: queryKeys.wishlist, queryFn: () => api.wishlist.list() })
}

export function useAddToWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (entry: Omit<WishlistEntry, 'addedAt'>) => api.wishlist.add(entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.wishlist }),
  })
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (placeId: string) => api.wishlist.remove(placeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.wishlist }),
  })
}
