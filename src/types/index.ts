export interface Coordinates {
  lat: number
  lng: number
}

export type GeolocationStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'error'

export type RadiusMeters = 500 | 1000 | 2000 | 5000

export type PriceLevel = 0 | 1 | 2 | 3 | 4

export interface Filters {
  radius: RadiusMeters
  cuisines: string[]
  openNow: boolean
  priceLevels: PriceLevel[]
}

export interface Restaurant {
  placeId: string
  name: string
  vicinity: string
  cuisineTypes: string[]
  rating: number | null
  userRatingsTotal: number | null
  priceLevel: PriceLevel | null
  photoUrl: string | null
  openNow: boolean | null
  distanceMeters: number
  mapsUrl: string
}

export interface VisitRecord {
  id: string
  restaurant: Restaurant
  visitedAt: Date
  rating: number | null
  notes: string
  wouldVisitAgain: boolean | null
}

export type SpinStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export interface SpinState {
  status: SpinStatus
  result: Restaurant | null
  batch: Restaurant[]
  errorMessage: string | null
}

export type AppView = 'spin' | 'history'
