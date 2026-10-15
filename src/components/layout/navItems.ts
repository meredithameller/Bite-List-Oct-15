import type { IconName } from '@/components/ui/Icon'

export interface NavItem {
  to: string
  label: string
  icon: IconName
  /** The center "Log" action is rendered differently on mobile. */
  primary?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Next Up', icon: 'home' },
  { to: '/wishlist', label: 'Wishlist', icon: 'heart' },
  { to: '/log', label: 'Log', icon: 'plus', primary: true },
  { to: '/passport', label: 'Passport', icon: 'passport' },
  { to: '/profile', label: 'Profile', icon: 'user' },
]
