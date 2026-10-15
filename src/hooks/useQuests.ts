import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/api'
import { queryKeys } from './queryKeys'

export function useQuests() {
  return useQuery({ queryKey: queryKeys.quests, queryFn: () => api.quests.list() })
}

export function useQuest(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.quest(id ?? ''),
    queryFn: () => api.quests.getById(id ?? ''),
    enabled: !!id,
  })
}

export function useStartQuest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.quests.start(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.quests })
      void qc.invalidateQueries({ queryKey: ['feed'] })
    },
  })
}
