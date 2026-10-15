import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { City } from '@/api'

export type ThemePref = 'system' | 'light' | 'dark'

interface UiState {
  theme: ThemePref
  /** Mock "where am I right now" for distances; null means use the profile's home city. */
  mockCity: City | null
  setTheme: (theme: ThemePref) => void
  setMockCity: (city: City | null) => void
}

export function applyTheme(theme: ThemePref) {
  const root = document.documentElement
  if (theme === 'system') delete root.dataset.theme
  else root.dataset.theme = theme
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'system',
      mockCity: null,
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      setMockCity: (mockCity) => set({ mockCity }),
    }),
    {
      name: 'bitelist.ui',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)
