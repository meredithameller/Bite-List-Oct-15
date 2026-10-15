import { format, formatDistanceToNowStrict, isSameDay, parseISO } from 'date-fns'
import type { PriceTier } from '@/api/types'

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n)

export const priceTierLabel = (tier: PriceTier) => '$'.repeat(tier)

export const formatDate = (iso: string) => format(parseISO(iso), 'MMM d, yyyy')
export const formatShortDate = (iso: string) => format(parseISO(iso), 'MMM d')

export const timeAgo = (iso: string) =>
  formatDistanceToNowStrict(parseISO(iso), { addSuffix: true })

export function deadlineLabel(endsAtIso: string, now = new Date()) {
  const end = parseISO(endsAtIso)
  if (end < now) return 'Ended'
  if (isSameDay(end, now)) return 'Ends today'
  return `Ends ${format(end, 'MMM d')} (${formatDistanceToNowStrict(end)} left)`
}

export function formatDistance(km: number) {
  const miles = km * 0.621371
  return miles < 0.2 ? 'Right here' : `${miles.toFixed(1)} mi`
}
