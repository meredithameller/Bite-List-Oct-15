import type { PriceTier } from '@/api/types'

export const CUISINES = [
  'Cuban',
  'Mexican',
  'Southern',
  'BBQ',
  'Seafood',
  'Japanese',
  'Vietnamese',
  'Italian',
  'Bakery',
  'Brunch',
  'New American',
  'Hot Chicken',
] as const

export const DIETARY_NEEDS = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Nut allergy',
  'Halal',
] as const

export const BUDGET_OPTIONS: { tier: PriceTier; label: string; hint: string }[] = [
  { tier: 1, label: '$', hint: 'Cheap eats' },
  { tier: 2, label: '$$', hint: 'Easy weeknight' },
  { tier: 3, label: '$$$', hint: 'Nice night out' },
  { tier: 4, label: '$$$$', hint: 'Special occasion' },
]

export const CUISINE_ICONS: Record<(typeof CUISINES)[number], string> = {
  Cuban: '🥪',
  Mexican: '🌮',
  Southern: '🍗',
  BBQ: '🍖',
  Seafood: '🦪',
  Japanese: '🍣',
  Vietnamese: '🍜',
  Italian: '🍝',
  Bakery: '🥐',
  Brunch: '🥞',
  'New American': '🍽️',
  'Hot Chicken': '🌶️',
}

export const DIETARY_ICONS: Record<(typeof DIETARY_NEEDS)[number], string> = {
  Vegetarian: '🥬',
  Vegan: '🌱',
  'Gluten-free': '🌾',
  'Dairy-free': '🥛',
  'Nut allergy': '🥜',
  Halal: '☪️',
}
