# TDD: Pure Logic Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Vitest and write 16 regression-baseline tests across `random.ts`, `distance.ts`, `storage.ts`, `db.ts`, and `placesService.ts`, with full isolation and shared test helpers.

**Architecture:** Vitest runs in a jsdom environment. `fake-indexeddb/auto` is loaded via a global setup file to replace IndexedDB before any suite runs. A shared `mockPlaces.ts` helper stubs the `google` global so `placesService.ts` can be tested without a live Maps API. Three private functions in `placesService.ts` are exported before testing begins — this is the only production code change.

**Tech Stack:** Vitest 2.x, jsdom, fake-indexeddb, TypeScript strict mode.

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `package.json` | Add test scripts |
| Modify | `vite.config.ts` | Add `test` block |
| Modify | `tsconfig.app.json` | Add `vitest/globals` to types |
| Modify | `src/services/placesService.ts` | Export 3 private functions |
| Create | `src/__tests__/setup.ts` | Global test setup (fake-indexeddb) |
| Create | `src/__tests__/helpers/mockStorage.ts` | localStorage isolation helper |
| Create | `src/__tests__/helpers/mockPlaces.ts` | Google Maps global stub |
| Create | `src/__tests__/utils/random.test.ts` | 2 tests |
| Create | `src/__tests__/utils/distance.test.ts` | 3 tests |
| Create | `src/__tests__/utils/storage.test.ts` | 3 tests |
| Create | `src/__tests__/services/db.test.ts` | 3 tests |
| Create | `src/__tests__/services/placesService.test.ts` | 5 tests |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Vitest and supporting packages**

```bash
cd "/Users/nicholasthian/Desktop/Code Repo/eatwhatPWA"
npm install --save-dev vitest @vitest/coverage-v8 jsdom fake-indexeddb
```

Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add test scripts to `package.json`**

Open `package.json`. In the `"scripts"` object, add after the existing entries:

```json
"test": "vitest",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 3: Verify scripts appear correctly**

```bash
npm run test:run -- --version
```

Expected: Vitest version printed, no errors.

---

## Task 2: Configure Vitest

**Files:**
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`

- [ ] **Step 1: Add `test` block to `vite.config.ts`**

Add a `test` property inside `defineConfig({...})`, after the `plugins` array:

```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['src/__tests__/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov'],
  },
},
```

The full `vite.config.ts` should now look like:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'EatWhat — Random Restaurant Finder',
        short_name: 'EatWhat',
        description: 'Tap once. Eat somewhere new. Singapore random restaurant finder.',
        theme_color: '#F97316',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'en-SG',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /maps\.googleapis\.com/,
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
```

- [ ] **Step 2: Add `vitest/globals` type to `tsconfig.app.json`**

In `tsconfig.app.json`, add a `"types"` array to `compilerOptions`:

```json
"types": ["vitest/globals"]
```

The full `compilerOptions` block becomes:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create the global setup file**

Create `src/__tests__/setup.ts`:

```ts
import 'fake-indexeddb/auto'
```

This installs the in-memory IndexedDB implementation globally before any test suite runs.

- [ ] **Step 4: Smoke-test the config**

```bash
npm run test:run
```

Expected: "No test files found" (or 0 tests pass). No config errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.app.json src/__tests__/setup.ts
git commit -m "chore: install and configure Vitest with jsdom and fake-indexeddb"
```

---

## Task 3: Export private functions from placesService.ts

**Files:**
- Modify: `src/services/placesService.ts`

Three functions — `getPhotoUrl`, `parsePriceLevel`, and `placeToRestaurant` — are currently private (no `export` keyword). They must be exported so test files can import them directly.

- [ ] **Step 1: Add `export` to the three functions**

Change line 10 from:
```ts
function getPhotoUrl(
```
to:
```ts
export function getPhotoUrl(
```

Change line 19 from:
```ts
function parsePriceLevel(level: number | undefined): PriceLevel | null {
```
to:
```ts
export function parsePriceLevel(level: number | undefined): PriceLevel | null {
```

Change line 25 from:
```ts
function placeToRestaurant(
```
to:
```ts
export function placeToRestaurant(
```

- [ ] **Step 2: Verify the build still passes**

```bash
npm run build
```

Expected: TypeScript compiles cleanly. No new errors.

- [ ] **Step 3: Commit**

```bash
git add src/services/placesService.ts
git commit -m "refactor: export getPhotoUrl, parsePriceLevel, placeToRestaurant for testability"
```

---

## Task 4: Create shared test helpers

**Files:**
- Create: `src/__tests__/helpers/mockStorage.ts`
- Create: `src/__tests__/helpers/mockPlaces.ts`

### mockStorage.ts

Provides `setupStorageMock()` / `teardownStorageMock()` which replace `localStorage` with an isolated in-memory map per test.

- [ ] **Step 1: Create `src/__tests__/helpers/mockStorage.ts`**

```ts
let store: Record<string, string> = {}

export function setupStorageMock() {
  store = {}
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
    (key: string) => store[key] ?? null,
  )
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
    (key: string, value: string) => {
      store[key] = value
    },
  )
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
    delete store[key]
  })
  vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
    store = {}
  })
}

export function teardownStorageMock() {
  vi.restoreAllMocks()
}
```

### mockPlaces.ts

Stubs the `google` global so `placesService.ts` functions can run in jsdom.

`fetchNearbyRestaurants` internally:
1. Calls `new google.maps.LatLng(lat, lng)` to build the request
2. Calls `service.nearbySearch(request, callback)` on the passed-in service instance
3. Checks `status === google.maps.places.PlacesServiceStatus.OK`

The mock provides a `google` global and a factory for fake service instances and fake `PlaceResult` objects.

- [ ] **Step 2: Create `src/__tests__/helpers/mockPlaces.ts`**

```ts
// Minimal shape of a PlaceResult that placesService.ts actually reads
export type MockPlaceResult = {
  place_id?: string
  name?: string
  geometry?: { location: { lat: () => number; lng: () => number } }
  vicinity?: string
  types?: string[]
  rating?: number
  user_ratings_total?: number
  price_level?: number
  photos?: Array<{ getUrl: (_opts: { maxWidth: number }) => string }>
  opening_hours?: { isOpen: () => boolean }
}

export function makeMockPlace(overrides: Partial<MockPlaceResult> = {}): MockPlaceResult {
  return {
    place_id: 'place-001',
    name: 'Test Restaurant',
    geometry: {
      location: { lat: () => 1.2847, lng: () => 103.8511 },
    },
    vicinity: '1 Test Street',
    types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
    rating: 4.2,
    user_ratings_total: 100,
    price_level: 2,
    photos: [],
    opening_hours: { isOpen: () => true },
    ...overrides,
  }
}

// Returns a mock PlacesService instance whose nearbySearch calls callback synchronously
export function makeMockService(places: MockPlaceResult[]) {
  return {
    nearbySearch: vi.fn(
      (_request: unknown, callback: (r: MockPlaceResult[], status: string) => void) => {
        callback(places, 'OK')
      },
    ),
  }
}

export function setupGoogleMock() {
  vi.stubGlobal('google', {
    maps: {
      LatLng: vi.fn((lat: number, lng: number) => ({ lat: () => lat, lng: () => lng })),
      places: {
        PlacesServiceStatus: {
          OK: 'OK',
          ZERO_RESULTS: 'ZERO_RESULTS',
        },
      },
    },
  })
}

export function teardownGoogleMock() {
  vi.unstubAllGlobals()
}
```

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/helpers/
git commit -m "test: add mockStorage and mockPlaces test helpers"
```

---

## Task 5: Tests for random.ts

**Files:**
- Create: `src/__tests__/utils/random.test.ts`
- Reference: `src/utils/random.ts`

- [ ] **Step 1: Write the tests**

Create `src/__tests__/utils/random.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { pickRandom } from '../../utils/random'

describe('pickRandom', () => {
  it('returns null for an empty array', () => {
    expect(pickRandom([])).toBeNull()
  })

  it('returns an item that exists in the array', () => {
    const items = ['a', 'b', 'c']
    const result = pickRandom(items)
    expect(items).toContain(result)
  })
})
```

- [ ] **Step 2: Run and confirm both pass**

```bash
npm run test:run -- src/__tests__/utils/random.test.ts
```

Expected output:
```
✓ src/__tests__/utils/random.test.ts (2)
  ✓ pickRandom > returns null for an empty array
  ✓ pickRandom > returns an item that exists in the array
Test Files  1 passed (1)
Tests       2 passed (2)
```

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/utils/random.test.ts
git commit -m "test: add regression tests for pickRandom"
```

---

## Task 6: Tests for distance.ts

**Files:**
- Create: `src/__tests__/utils/distance.test.ts`
- Reference: `src/utils/distance.ts`

- [ ] **Step 1: Write the tests**

Create `src/__tests__/utils/distance.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { haversineDistance, formatDistance } from '../../utils/distance'

describe('haversineDistance', () => {
  it('calculates the distance between Singapore CBD and Changi Airport within ±0.5 km', () => {
    // Raffles Place MRT: 1.2847° N, 103.8511° E
    // Changi Airport T3: 1.3644° N, 103.9915° E
    // Real-world straight-line distance: ~17.5 km
    const cbd = { lat: 1.2847, lng: 103.8511 }
    const changi = { lat: 1.3644, lng: 103.9915 }
    const distanceKm = haversineDistance(cbd, changi) / 1000
    expect(distanceKm).toBeGreaterThan(17.0)
    expect(distanceKm).toBeLessThan(18.0)
  })
})

describe('formatDistance', () => {
  it('formats distances below 1000 m as metres', () => {
    expect(formatDistance(999)).toBe('999 m')
  })

  it('formats distances at and above 1000 m as kilometres', () => {
    expect(formatDistance(1000)).toBe('1.0 km')
    expect(formatDistance(1500)).toBe('1.5 km')
  })
})
```

- [ ] **Step 2: Run and confirm all pass**

```bash
npm run test:run -- src/__tests__/utils/distance.test.ts
```

Expected:
```
✓ src/__tests__/utils/distance.test.ts (3)
Test Files  1 passed (1)
Tests       3 passed (3)
```

This file produces 3 `it` blocks: 1 for `haversineDistance` and 2 for `formatDistance` (below/above boundary as separate cases).

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/utils/distance.test.ts
git commit -m "test: add regression tests for haversineDistance and formatDistance"
```

---

## Task 7: Tests for storage.ts

**Files:**
- Create: `src/__tests__/utils/storage.test.ts`
- Reference: `src/utils/storage.ts`, `src/__tests__/helpers/mockStorage.ts`

- [ ] **Step 1: Write the tests**

Create `src/__tests__/utils/storage.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadFromStorage, saveToStorage } from '../../utils/storage'
import { setupStorageMock, teardownStorageMock } from '../helpers/mockStorage'

beforeEach(() => setupStorageMock())
afterEach(() => teardownStorageMock())

describe('loadFromStorage', () => {
  it('returns the fallback when the key does not exist', () => {
    const result = loadFromStorage('missing-key', 42)
    expect(result).toBe(42)
  })

  it('returns the fallback and does not throw when stored value is malformed JSON', () => {
    localStorage.setItem('bad-key', '{not valid json}')
    expect(() => loadFromStorage('bad-key', 'fallback')).not.toThrow()
    expect(loadFromStorage('bad-key', 'fallback')).toBe('fallback')
  })
})

describe('saveToStorage + loadFromStorage', () => {
  it('round-trips a value correctly', () => {
    const value = { radius: 1000, cuisines: ['Japanese'] }
    saveToStorage('test-key', value)
    const result = loadFromStorage('test-key', null)
    expect(result).toEqual(value)
  })
})
```

- [ ] **Step 2: Run and confirm all pass**

```bash
npm run test:run -- src/__tests__/utils/storage.test.ts
```

Expected:
```
✓ src/__tests__/utils/storage.test.ts (3)
Test Files  1 passed (1)
Tests       3 passed (3)
```

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/utils/storage.test.ts
git commit -m "test: add regression tests for loadFromStorage and saveToStorage"
```

---

## Task 8: Tests for db.ts

**Files:**
- Create: `src/__tests__/services/db.test.ts`
- Reference: `src/services/db.ts`, `src/types/index.ts`

Each test gets a fresh in-memory database by:
1. Calling `vi.resetModules()` in `beforeEach` and dynamically re-importing `db.ts` — this resets the `dbPromise` singleton
2. Calling `indexedDB.deleteDatabase('eatwhat-db')` in `afterEach` — this wipes the named store from `fake-indexeddb`

- [ ] **Step 1: Write the tests**

Create `src/__tests__/services/db.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { VisitRecord } from '../../types'
import type * as DbModule from '../../services/db'

// Dynamically imported per test so the dbPromise singleton is always fresh
let db: typeof DbModule

function makeRecord(overrides: Partial<VisitRecord> = {}): VisitRecord {
  return {
    id: 'visit-001',
    restaurant: {
      placeId: 'place-001',
      name: 'Test Restaurant',
      vicinity: '1 Test Street',
      cuisineTypes: [],
      rating: 4.0,
      userRatingsTotal: 50,
      priceLevel: 2,
      photoUrl: null,
      openNow: true,
      distanceMeters: 500,
      mapsUrl: 'https://maps.google.com/?q=place_id:place-001',
    },
    visitedAt: new Date('2026-03-20T12:00:00Z'),
    rating: 4,
    notes: 'Good food',
    wouldVisitAgain: true,
    ...overrides,
  }
}

beforeEach(async () => {
  vi.resetModules()
  db = await import('../../services/db')
})

afterEach(async () => {
  // Close the open idb connection first — deleteDatabase is blocked until all
  // connections are closed, so skipping this causes afterEach to hang forever.
  const conn = await db.getDb()
  conn.close()
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase('eatwhat-db')
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
})

describe('addVisitRecord + getAllVisits', () => {
  it('persists a record and retrieves it', async () => {
    const record = makeRecord()
    await db.addVisitRecord(record)
    const all = await db.getAllVisits()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe('visit-001')
  })
})

describe('deleteVisitRecord', () => {
  it('removes the record so getAllVisits returns empty', async () => {
    const record = makeRecord()
    await db.addVisitRecord(record)
    await db.deleteVisitRecord('visit-001')
    const all = await db.getAllVisits()
    expect(all).toHaveLength(0)
  })
})

describe('getVisitsByPlaceId', () => {
  it('returns only records matching the given placeId', async () => {
    const match = makeRecord({ id: 'visit-001' })
    const noMatch = makeRecord({
      id: 'visit-002',
      restaurant: { ...makeRecord().restaurant, placeId: 'place-999' },
    })
    await db.addVisitRecord(match)
    await db.addVisitRecord(noMatch)
    const results = await db.getVisitsByPlaceId('place-001')
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('visit-001')
  })
})
```

- [ ] **Step 2: Run and confirm all pass**

```bash
npm run test:run -- src/__tests__/services/db.test.ts
```

Expected:
```
✓ src/__tests__/services/db.test.ts (3)
Test Files  1 passed (1)
Tests       3 passed (3)
```

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/services/db.test.ts
git commit -m "test: add regression tests for db addVisitRecord, deleteVisitRecord, getVisitsByPlaceId"
```

---

## Task 9: Tests for placesService.ts

**Files:**
- Create: `src/__tests__/services/placesService.test.ts`
- Reference: `src/services/placesService.ts`, `src/__tests__/helpers/mockPlaces.ts`

`fetchNearbyRestaurants` is an `async` function — tests use `await`.
`placeToRestaurant`, `parsePriceLevel`, and `getPhotoUrl` are now exported (Task 3).

- [ ] **Step 1: Write the tests**

Create `src/__tests__/services/placesService.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  fetchNearbyRestaurants,
  placeToRestaurant,
  parsePriceLevel,
  getPhotoUrl,
} from '../../services/placesService'
import type { Filters } from '../../types'
import {
  makeMockPlace,
  makeMockService,
  setupGoogleMock,
  teardownGoogleMock,
  type MockPlaceResult,
} from '../helpers/mockPlaces'

const USER_LOCATION = { lat: 1.2847, lng: 103.8511 }

const BASE_FILTERS: Filters = {
  radius: 1000,
  cuisines: [],
  openNow: false,
  priceLevels: [],
}

beforeEach(() => setupGoogleMock())
afterEach(() => teardownGoogleMock())

describe('placeToRestaurant', () => {
  it('maps all fields correctly and returns null when required fields are missing', () => {
    // Full mapping
    const place = makeMockPlace({
      place_id: 'place-abc',
      name: 'Noodle House',
      geometry: { location: { lat: () => 1.3000, lng: () => 103.8600 } },
      vicinity: '10 Orchard Rd',
      rating: 4.5,
      user_ratings_total: 200,
      price_level: 1,
      types: ['restaurant', 'chinese_restaurant', 'food'],
      photos: [{ getUrl: () => 'https://photo.url/img.jpg' }],
      opening_hours: { isOpen: () => false },
    })

    const result = placeToRestaurant(
      place as unknown as google.maps.places.PlaceResult,
      USER_LOCATION,
    )

    expect(result).not.toBeNull()
    expect(result!.placeId).toBe('place-abc')
    expect(result!.name).toBe('Noodle House')
    expect(result!.vicinity).toBe('10 Orchard Rd')
    expect(result!.rating).toBe(4.5)
    expect(result!.priceLevel).toBe(1)
    expect(result!.openNow).toBe(false)
    expect(result!.photoUrl).toBe('https://photo.url/img.jpg')
    // cuisineTypes should exclude 'food', 'point_of_interest', 'establishment'
    expect(result!.cuisineTypes).toEqual(['restaurant', 'chinese_restaurant'])
    expect(result!.distanceMeters).toBeGreaterThan(0)

    // Returns null when place_id is missing
    const noId = makeMockPlace({ place_id: undefined })
    expect(
      placeToRestaurant(noId as unknown as google.maps.places.PlaceResult, USER_LOCATION),
    ).toBeNull()
  })
})

describe('parsePriceLevel', () => {
  it('returns null for undefined, and the numeric value for valid levels', () => {
    expect(parsePriceLevel(undefined)).toBeNull()
    expect(parsePriceLevel(0)).toBe(0)
    expect(parsePriceLevel(4)).toBe(4)
  })
})

describe('getPhotoUrl', () => {
  it('returns null when the place has no photos', () => {
    const place = makeMockPlace({ photos: [] })
    expect(
      getPhotoUrl(place as unknown as google.maps.places.PlaceResult),
    ).toBeNull()
  })
})

describe('fetchNearbyRestaurants', () => {
  it('returns results when cuisines filter is empty', async () => {
    const place = makeMockPlace()
    const service = makeMockService([place])

    const results = await fetchNearbyRestaurants(
      service as unknown as google.maps.places.PlacesService,
      USER_LOCATION,
      BASE_FILTERS,
    )

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].placeId).toBe('place-001')
  })

  it('deduplicates results when two cuisine searches return the same place', async () => {
    // Both cuisine queries return the same place_id
    const sharedPlace = makeMockPlace({ place_id: 'shared-place' })
    const service = makeMockService([sharedPlace])

    const filters: Filters = { ...BASE_FILTERS, cuisines: ['Japanese', 'Ramen'] }

    const results = await fetchNearbyRestaurants(
      service as unknown as google.maps.places.PlacesService,
      USER_LOCATION,
      filters,
    )

    // Despite two queries each returning the same place, only one should appear
    expect(results.filter((r) => r.placeId === 'shared-place')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run and confirm all 5 tests pass**

```bash
npm run test:run -- src/__tests__/services/placesService.test.ts
```

Expected:
```
✓ src/__tests__/services/placesService.test.ts (5)
Test Files  1 passed (1)
Tests       5 passed (5)
```

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/services/placesService.test.ts
git commit -m "test: add regression tests for placeToRestaurant, parsePriceLevel, getPhotoUrl, fetchNearbyRestaurants"
```

---

## Task 10: Full suite verification

- [ ] **Step 1: Run all tests**

```bash
npm run test:run
```

Expected:
```
Test Files  5 passed (5)
Tests       16 passed (16)
```

- [ ] **Step 2: Run coverage**

```bash
npm run test:coverage
```

Expected: ≥80% line coverage on all 5 source files (`random.ts`, `distance.ts`, `storage.ts`, `db.ts`, `placesService.ts`).

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

Expected: Clean TypeScript compilation, no errors.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "test: complete pure logic layer test suite — 16 tests passing"
```
