import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type City, type OnboardingInput } from '@/api'
import { useUiStore } from '@/store/uiStore'
import { queryKeys } from './queryKeys'

export function useProfile() {
  return useQuery({ queryKey: queryKeys.profile, queryFn: () => api.profile.getProfile() })
}

export function useProfileStats() {
  return useQuery({ queryKey: queryKeys.stats, queryFn: () => api.profile.getStats() })
}

/** The city used for distances: the mock switch if set, else the profile's home city. */
export function useCurrentCity(): City {
  const mockCity = useUiStore((s) => s.mockCity)
  const { data } = useProfile()
  return mockCity ?? data?.homeCity ?? 'Tampa'
}

export function useCompleteOnboarding() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: OnboardingInput) => api.profile.completeOnboarding(input),
    onSuccess: () => qc.invalidateQueries(),
  })
}

export function useResetDemoData() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.profile.resetDemoData(),
    onSuccess: () => {
      useUiStore.getState().setMockCity(null)
      return qc.invalidateQueries()
    },
  })
}
