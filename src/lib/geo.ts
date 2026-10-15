import type { City } from '@/api/types'

export const CITIES: City[] = ['Tampa', 'Nashville']

export const CITY_CENTERS: Record<City, { lat: number; lng: number }> = {
  Tampa: { lat: 27.9506, lng: -82.4572 },
  Nashville: { lat: 36.1627, lng: -86.7816 },
}

const EARTH_KM = 6371

/** Great-circle distance in kilometres. */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h))
}

export function distanceFromCity(city: City, point: { lat: number; lng: number }) {
  return haversineKm(CITY_CENTERS[city], point)
}
