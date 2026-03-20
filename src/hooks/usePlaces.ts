import { useState, useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface UsePlacesReturn {
  service: google.maps.places.PlacesService | null
  isLoaded: boolean
  loadError: string | null
}

export function usePlaces(): UsePlacesReturn {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const serviceRef = useRef<google.maps.places.PlacesService | null>(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
    if (!apiKey) {
      setLoadError('Google Maps API key is missing. Set VITE_GOOGLE_MAPS_API_KEY in .env')
      return
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    })

    loader
      .load()
      .then(() => {
        // PlacesService requires a map or an HTML element
        const el = document.createElement('div')
        serviceRef.current = new google.maps.places.PlacesService(el)
        setIsLoaded(true)
      })
      .catch((err: unknown) => {
        setLoadError(
          err instanceof Error ? err.message : 'Failed to load Google Maps',
        )
      })
  }, [])

  return { service: serviceRef.current, isLoaded, loadError }
}
