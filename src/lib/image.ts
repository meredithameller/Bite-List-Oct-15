/**
 * Photos are strings: either a real image (data URL) or a built-in illustrated
 * placeholder written as "art:<seed>|<emoji>".
 */
const FOOD_EMOJI = ['🌮', '🍜', '🥪', '🍗', '🦪', '🥐', '🍣', '🍝', '🥘', '🍕', '🥗', '🍰']

export interface Art {
  hue: number
  emoji: string
}

function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export const makeArt = (seed: string, emoji?: string) => `art:${seed}|${emoji ?? ''}`
export const isArt = (photo: string) => photo.startsWith('art:')

export function parseArt(photo: string): Art {
  const body = photo.slice(4)
  const [seed = '', emoji = ''] = body.split('|')
  const h = hash(seed)
  return {
    hue: 8 + (h % 50), // warm range: reds to ambers
    emoji: emoji || FOOD_EMOJI[h % FOOD_EMOJI.length] || '🍽️',
  }
}

const MAX_EDGE = 600

/** Shrinks an uploaded photo to a small JPEG data URL so localStorage can hold it. */
export async function resizeImageToDataUrl(file: File, maxEdge = MAX_EDGE): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not process that photo.')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.72)
}

const CUISINE_EMOJI: Record<string, string> = {
  cuban: '🥪',
  sandwiches: '🥪',
  mexican: '🌮',
  tacos: '🌮',
  seafood: '🦪',
  oysters: '🦪',
  vietnamese: '🍜',
  noodles: '🍜',
  ramen: '🍜',
  japanese: '🍣',
  bakery: '🥐',
  brunch: '🥞',
  southern: '🍗',
  'hot chicken': '🍗',
  bbq: '🍖',
  'new american': '🍽️',
  'wood-fired': '🔥',
  'tasting menu': '🍷',
  chinese: '🥟',
  dumplings: '🥟',
  italian: '🍝',
}

/** An illustrated placeholder photo for a place, themed by its cuisine. */
export function placeArt(place: { id: string; cuisines: string[] }): string {
  const emoji = place.cuisines.map((c) => CUISINE_EMOJI[c.toLowerCase()]).find(Boolean)
  return makeArt(place.id, emoji)
}
