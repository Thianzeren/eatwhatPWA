import { useState, useCallback } from 'react'
import type { Coordinates, GeolocationStatus } from '../types'

interface UseGeolocationReturn {
  location: Coordinates | null
  status: GeolocationStatus
  requestLocation: () => void
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [status, setStatus] = useState<GeolocationStatus>('idle')

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable')
      return
    }
    setStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('granted')
      },
      (err) => {
        if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
          setStatus('denied')
        } else {
          setStatus('error')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  return { location, status, requestLocation }
}
