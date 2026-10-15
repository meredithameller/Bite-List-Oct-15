import { useQuery } from '@tanstack/react-query'
import { api } from '@/api'
import { queryKeys } from './queryKeys'

export function usePassport() {
  return useQuery({ queryKey: queryKeys.passport, queryFn: () => api.passport.get() })
}
