import { useState, useCallback } from 'react'
import type { Filters, RadiusMeters, PriceLevel } from '../types'
import { DEFAULT_FILTERS, FILTERS_STORAGE_KEY } from '../constants'
import { loadFromStorage, saveToStorage } from '../utils/storage'

export interface UseFiltersReturn {
  filters: Filters
  setRadius: (r: RadiusMeters) => void
  toggleCuisine: (cuisine: string) => void
  setCuisines: (cuisines: string[]) => void
  setOpenNow: (open: boolean) => void
  togglePriceLevel: (level: PriceLevel) => void
  resetFilters: () => void
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<Filters>(() =>
    loadFromStorage<Filters>(FILTERS_STORAGE_KEY, DEFAULT_FILTERS),
  )

  const update = useCallback((patch: Partial<Filters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch }
      saveToStorage(FILTERS_STORAGE_KEY, next)
      return next
    })
  }, [])

  const setRadius = useCallback(
    (radius: RadiusMeters) => update({ radius }),
    [update],
  )

  const toggleCuisine = useCallback(
    (cuisine: string) => {
      setFilters((prev) => {
        const next = prev.cuisines.includes(cuisine)
          ? prev.cuisines.filter((c) => c !== cuisine)
          : [...prev.cuisines, cuisine]
        const updated = { ...prev, cuisines: next }
        saveToStorage(FILTERS_STORAGE_KEY, updated)
        return updated
      })
    },
    [],
  )

  const setCuisines = useCallback(
    (cuisines: string[]) => update({ cuisines }),
    [update],
  )

  const setOpenNow = useCallback(
    (openNow: boolean) => update({ openNow }),
    [update],
  )

  const togglePriceLevel = useCallback(
    (level: PriceLevel) => {
      setFilters((prev) => {
        const next = prev.priceLevels.includes(level)
          ? prev.priceLevels.filter((p) => p !== level)
          : [...prev.priceLevels, level]
        const updated = { ...prev, priceLevels: next }
        saveToStorage(FILTERS_STORAGE_KEY, updated)
        return updated
      })
    },
    [],
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    saveToStorage(FILTERS_STORAGE_KEY, DEFAULT_FILTERS)
  }, [])

  return {
    filters,
    setRadius,
    toggleCuisine,
    setCuisines,
    setOpenNow,
    togglePriceLevel,
    resetFilters,
  }
}
