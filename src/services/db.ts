import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { VisitRecord } from '../types'

interface EatWhatDB extends DBSchema {
  visits: {
    key: string
    value: VisitRecord
    indexes: {
      'by-placeId': string
      'by-visitedAt': Date
    }
  }
}

let dbPromise: Promise<IDBPDatabase<EatWhatDB>> | null = null

export function getDb(): Promise<IDBPDatabase<EatWhatDB>> {
  if (!dbPromise) {
    dbPromise = openDB<EatWhatDB>('eatwhat-db', 1, {
      upgrade(database) {
        const store = database.createObjectStore('visits', { keyPath: 'id' })
        store.createIndex('by-placeId', 'restaurant.placeId')
        store.createIndex('by-visitedAt', 'visitedAt')
      },
    })
  }
  return dbPromise
}

export async function getAllVisits(): Promise<VisitRecord[]> {
  const db = await getDb()
  return db.getAll('visits')
}

export async function addVisitRecord(record: VisitRecord): Promise<void> {
  const db = await getDb()
  await db.put('visits', record)
}

export async function updateVisitRecord(
  id: string,
  changes: Partial<VisitRecord>,
): Promise<void> {
  const db = await getDb()
  const existing = await db.get('visits', id)
  if (!existing) return
  await db.put('visits', { ...existing, ...changes, id })
}

export async function deleteVisitRecord(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('visits', id)
}

export async function getVisitsByPlaceId(placeId: string): Promise<VisitRecord[]> {
  const db = await getDb()
  return db.getAllFromIndex('visits', 'by-placeId', placeId)
}
