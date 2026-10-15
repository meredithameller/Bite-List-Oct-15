import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { LogFormValues } from '@/features/log/schema'

/** localStorage that never throws (full disk, private mode...). A lost draft beats a crash. */
const safeStorage: StateStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // ignore
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}

interface DraftLogState {
  values: LogFormValues | null
  /** In-memory only: true between a successful save and the next time the form opens. */
  saved: boolean
  setValues: (values: LogFormValues) => void
  /** The visit was saved: drop the draft and ignore late autosaves. */
  markSaved: () => void
  /** The form was opened: autosave is live again. */
  open: () => void
  clear: () => void
}

/** The in-progress Quick Log, autosaved so nothing is lost if the user leaves. */
export const useDraftLogStore = create<DraftLogState>()(
  persist(
    (set) => ({
      values: null,
      saved: false,
      setValues: (values) => set((s) => (s.saved ? s : { values })),
      markSaved: () => set({ values: null, saved: true }),
      open: () => set({ saved: false }),
      clear: () => set({ values: null }),
    }),
    {
      name: 'bitelist.logDraft',
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ values: s.values }),
    },
  ),
)
