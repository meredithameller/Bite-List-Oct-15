import type { WishlistSource } from '@/api'

export const SOURCES: { value: WishlistSource; label: string; emoji: string }[] = [
  { value: 'friend', label: 'Friend', emoji: '🧑‍🤝‍🧑' },
  { value: 'social', label: 'Social', emoji: '📱' },
  { value: 'press', label: 'Press', emoji: '📰' },
  { value: 'other', label: 'Other', emoji: '✨' },
]

export const sourceLabel = (s: WishlistSource) => SOURCES.find((x) => x.value === s)?.label ?? s
export const sourceEmoji = (s: WishlistSource) => SOURCES.find((x) => x.value === s)?.emoji ?? '✨'
