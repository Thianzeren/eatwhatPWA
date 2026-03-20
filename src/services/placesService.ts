import type { Coordinates, Restaurant, Filters, PriceLevel } from '../types'
import { haversineDistance } from '../utils/distance'

type PlacesServiceInstance = google.maps.places.PlacesService

function buildMapsUrl(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`
}

function getPhotoUrl(
  place: google.maps.places.PlaceResult,
  maxWidth = 800,
): string | null {
  const photos = place.photos
  if (!photos || photos.length === 0) return null
  return photos[0].getUrl({ maxWidth })
}

function parsePriceLevel(level: number | undefined): PriceLevel | null {
  if (level === undefined || level === null) return null
  if (level >= 0 && level <= 4) return level as PriceLevel
  return null
}

function placeToRestaurant(
  place: google.maps.places.PlaceResult,
  userLocation: Coordinates,
): Restaurant | null {
  if (!place.place_id || !place.name || !place.geometry?.location) return null

  const lat = place.geometry.location.lat()
  const lng = place.geometry.location.lng()
  const distance = haversineDistance(userLocation, { lat, lng })

  return {
    placeId: place.place_id,
    name: place.name,
    vicinity: place.vicinity ?? '',
    cuisineTypes: place.types?.filter((t) => t !== 'food' && t !== 'point_of_interest' && t !== 'establishment') ?? [],
    rating: place.rating ?? null,
    userRatingsTotal: place.user_ratings_total ?? null,
    priceLevel: parsePriceLevel(place.price_level),
    photoUrl: getPhotoUrl(place),
    openNow: place.opening_hours?.isOpen() ?? null,
    distanceMeters: Math.round(distance),
    mapsUrl: buildMapsUrl(place.place_id),
  }
}

function nearbySearchPromise(
  service: PlacesServiceInstance,
  request: google.maps.places.PlaceSearchRequest,
): Promise<google.maps.places.PlaceResult[]> {
  return new Promise((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        resolve(results)
      } else if (
        status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
      ) {
        resolve([])
      } else {
        reject(new Error(`Places API error: ${status}`))
      }
    })
  })
}

export async function fetchNearbyRestaurants(
  service: PlacesServiceInstance,
  userLocation: Coordinates,
  filters: Filters,
): Promise<Restaurant[]> {
  const baseRequest: google.maps.places.PlaceSearchRequest = {
    location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
    radius: filters.radius,
    type: 'restaurant',
    openNow: filters.openNow || undefined,
  }

  let rawResults: google.maps.places.PlaceResult[]

  if (filters.cuisines.length === 0) {
    rawResults = await nearbySearchPromise(service, baseRequest)
  } else if (filters.cuisines.length === 1) {
    rawResults = await nearbySearchPromise(service, {
      ...baseRequest,
      keyword: filters.cuisines[0],
    })
  } else {
    // Parallel requests for each cuisine, deduplicate
    const results = await Promise.all(
      filters.cuisines.map((cuisine) =>
        nearbySearchPromise(service, { ...baseRequest, keyword: cuisine }),
      ),
    )
    const seen = new Set<string>()
    rawResults = []
    for (const batch of results) {
      for (const place of batch) {
        if (place.place_id && !seen.has(place.place_id)) {
          seen.add(place.place_id)
          rawResults.push(place)
        }
      }
    }
  }

  // Convert to Restaurant objects
  let restaurants = rawResults
    .map((p) => placeToRestaurant(p, userLocation))
    .filter((r): r is Restaurant => r !== null)

  // Client-side price level filter
  if (filters.priceLevels.length > 0) {
    restaurants = restaurants.filter(
      (r) =>
        r.priceLevel !== null && filters.priceLevels.includes(r.priceLevel),
    )
  }

  return restaurants
}
