import type { Filters, RadiusMeters, PriceLevel } from '../types'

export const RADIUS_OPTIONS: { label: string; value: RadiusMeters }[] = [
  { label: '500m', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
]

export const CUISINE_OPTIONS: string[] = [
  'Chinese',
  'Japanese',
  'Korean',
  'Thai',
  'Vietnamese',
  'Indian',
  'Malay',
  'Indonesian',
  'Western',
  'Italian',
  'Mexican',
  'Middle Eastern',
  'Hawker',
  'Seafood',
  'Vegetarian',
  'Fast Food',
  'Cafe',
  'Bakery',
  'Dessert',
]

export const PRICE_LEVEL_LABELS: Record<PriceLevel, string> = {
  0: 'Free',
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$',
}

export const DEFAULT_FILTERS: Filters = {
  radius: 1000,
  cuisines: [],
  openNow: true,
  priceLevels: [],
}

export const FILTERS_STORAGE_KEY = 'eatwhat_filters'
