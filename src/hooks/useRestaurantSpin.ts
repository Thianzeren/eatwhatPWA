import { useState, useCallback, useRef } from 'react'
import type { SpinState } from '../types'
import { useGeolocation } from './useGeolocation'
import { useFilters, type UseFiltersReturn } from './useFilters'
import { usePlaces } from './usePlaces'
import { fetchNearbyRestaurants } from '../services/placesService'
import { pickRandom, pickRandomExcluding } from '../utils/random'

export interface UseRestaurantSpinReturn {
  spinState: SpinState
  filterControls: UseFiltersReturn
  geoStatus: ReturnType<typeof useGeolocation>['status']
  retryLocation: () => void
  spin: () => void
  spinAgain: () => void
}

const INITIAL_STATE: SpinState = {
  status: 'idle',
  result: null,
  batch: [],
  errorMessage: null,
}

export function useRestaurantSpin(): UseRestaurantSpinReturn {
  const [spinState, setSpinState] = useState<SpinState>(INITIAL_STATE)
  const { location, status: geoStatus, requestLocation } = useGeolocation()
  const filterControls = useFilters()
  const { service, isLoaded, loadError } = usePlaces()

  // Track the filters snapshot at the time of last fetch so we can detect staleness
  const lastFetchFiltersRef = useRef<string | null>(null)

  const filtersKey = JSON.stringify(filterControls.filters)

  const isBatchStale = lastFetchFiltersRef.current !== filtersKey

  const spin = useCallback(async () => {
    if (!location) {
      requestLocation()
      return
    }
    if (loadError) {
      setSpinState({ status: 'error', result: null, batch: [], errorMessage: loadError })
      return
    }
    if (!isLoaded || !service) {
      return
    }

    // If we have a fresh batch, just pick from it
    if (!isBatchStale && spinState.batch.length > 0) {
      const pick = pickRandom(spinState.batch)
      if (pick) {
        setSpinState((prev) => ({ ...prev, status: 'success', result: pick }))
      }
      return
    }

    setSpinState({ status: 'loading', result: null, batch: [], errorMessage: null })
    lastFetchFiltersRef.current = filtersKey

    try {
      const restaurants = await fetchNearbyRestaurants(
        service,
        location,
        filterControls.filters,
      )

      if (restaurants.length === 0) {
        setSpinState({ status: 'empty', result: null, batch: [], errorMessage: null })
        return
      }

      const pick = pickRandom(restaurants)!
      setSpinState({
        status: 'success',
        result: pick,
        batch: restaurants,
        errorMessage: null,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setSpinState({ status: 'error', result: null, batch: [], errorMessage: msg })
    }
  }, [location, isLoaded, loadError, service, filterControls.filters, filtersKey, isBatchStale, spinState.batch, requestLocation])

  const spinAgain = useCallback(async () => {
    if (!location || !service || !isLoaded) return

    if (isBatchStale || spinState.batch.length === 0) {
      // Need a fresh batch
      await spin()
      return
    }

    // Pick a different restaurant from the existing batch
    const different = pickRandomExcluding(spinState.batch, spinState.result!)
    if (different) {
      setSpinState((prev) => ({ ...prev, status: 'success', result: different }))
    } else {
      // Only one result — just show it again or re-fetch
      await spin()
    }
  }, [location, service, isLoaded, isBatchStale, spinState.batch, spinState.result, spin])

  const retryLocation = useCallback(() => {
    requestLocation()
  }, [requestLocation])

  return {
    spinState,
    filterControls,
    geoStatus,
    retryLocation,
    spin,
    spinAgain,
  }
}
