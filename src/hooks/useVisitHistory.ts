import { useState, useEffect, useCallback } from 'react'
import type { VisitRecord, Restaurant } from '../types'
import {
  getAllVisits,
  addVisitRecord,
  updateVisitRecord,
  deleteVisitRecord,
} from '../services/db'
import { generateId } from '../utils/random'

export interface UseVisitHistoryReturn {
  visits: VisitRecord[]
  addVisit: (
    restaurant: Restaurant,
    review: Omit<VisitRecord, 'id' | 'restaurant' | 'visitedAt'>,
  ) => Promise<void>
  updateVisit: (id: string, changes: Partial<VisitRecord>) => Promise<void>
  deleteVisit: (id: string) => Promise<void>
  getVisitsByPlaceId: (placeId: string) => VisitRecord[]
  isLoading: boolean
}

export function useVisitHistory(): UseVisitHistoryReturn {
  const [visits, setVisits] = useState<VisitRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAllVisits()
      .then((all) => {
        const sorted = all.sort(
          (a, b) =>
            new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime(),
        )
        setVisits(sorted)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const addVisit = useCallback(
    async (
      restaurant: Restaurant,
      review: Omit<VisitRecord, 'id' | 'restaurant' | 'visitedAt'>,
    ) => {
      const record: VisitRecord = {
        id: generateId(),
        restaurant,
        visitedAt: new Date(),
        ...review,
      }
      await addVisitRecord(record)
      setVisits((prev) =>
        [record, ...prev].sort(
          (a, b) =>
            new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime(),
        ),
      )
    },
    [],
  )

  const updateVisit = useCallback(async (id: string, changes: Partial<VisitRecord>) => {
    await updateVisitRecord(id, changes)
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...changes } : v)),
    )
  }, [])

  const deleteVisit = useCallback(async (id: string) => {
    await deleteVisitRecord(id)
    setVisits((prev) => prev.filter((v) => v.id !== id))
  }, [])

  const getVisitsByPlaceIdLocal = useCallback(
    (placeId: string): VisitRecord[] => {
      return visits.filter((v) => v.restaurant.placeId === placeId)
    },
    [visits],
  )

  return {
    visits,
    addVisit,
    updateVisit,
    deleteVisit,
    getVisitsByPlaceId: getVisitsByPlaceIdLocal,
    isLoading,
  }
}
