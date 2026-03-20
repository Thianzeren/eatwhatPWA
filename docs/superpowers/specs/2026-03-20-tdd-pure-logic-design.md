# TDD: Pure Logic Layer — Design Spec

**Date:** 2026-03-20
**Scope:** Install Vitest, write tests for the pure logic layer (utils + services), fix uncovered bugs. Hooks and components are out of scope for this phase.
**Approach:** TDD — write failing test → fix bug → green → next. Where current behaviour is already correct, tests serve as regression baselines.

---

## 1. Setup

### Dependencies to install
```
vitest @vitest/coverage-v8 jsdom fake-indexeddb
```

### `vite.config.ts` — add `test` block
```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['src/__tests__/setup.ts'],
  coverage: { provider: 'v8', reporter: ['text', 'lcov'] }
}
```

### `src/__tests__/setup.ts` — created as the global setup file
```ts
import 'fake-indexeddb/auto'
```
This replaces IndexedDB globally before any test suite runs, so `db.test.ts` requires no additional setup.

### `tsconfig.app.json` — add to `compilerOptions.types`
```json
"types": ["vitest/globals"]
```

### `package.json` — add scripts
```json
"test":          "vitest",
"test:run":      "vitest run",
"test:coverage": "vitest run --coverage"
```

---

## 2. Directory Structure

```
src/
  __tests__/
    setup.ts               ← global test setup (fake-indexeddb)
    utils/
      random.test.ts
      distance.test.ts
      storage.test.ts
    services/
      db.test.ts
      placesService.test.ts
    helpers/
      mockStorage.ts       ← shared localStorage mock
      mockPlaces.ts        ← shared Google Places API stubs
```

---

## 3. Exports Required Before Testing

The following functions in `placesService.ts` are currently private (no `export` keyword). They must be exported before they can be unit tested directly:

- `placeToRestaurant`
- `parsePriceLevel`
- `getPhotoUrl`

These will be exported as named exports. This is the only production code change made before writing tests.

---

## 4. Tests Per Module

### `random.ts` — 2 tests (regression baselines)
| Test | Expectation |
|------|-------------|
| `pickRandom([])` | returns `null` |
| `pickRandom([a, b, c])` | returns one of the array items |

No bugs. These guard against regressions.

### `distance.ts` — 2 tests (regression baselines)
| Test | Expectation |
|------|-------------|
| Known coordinates: Singapore CBD → Changi Airport (~17.5 km) | result within ±0.5 km |
| `formatDistance` boundaries: 999 → `"999 m"`, 1000 → `"1.0 km"`, 1500 → `"1.5 km"` | correct string format |

No bugs expected. Tests serve as accuracy and formatting regression guards.

### `storage.ts` — 3 tests (regression baselines)
| Test | Expectation |
|------|-------------|
| Round-trip: save then load returns same value | returns saved value |
| Load with malformed JSON in localStorage | returns fallback, does not throw |
| Load with missing key | returns fallback |

No bugs to fix. `mockStorage.ts` wraps `vi.spyOn(Storage.prototype, ...)` and is called in `beforeEach`/`afterEach` to isolate localStorage state between tests.

### `db.ts` — 3 tests
| Test | Expectation |
|------|-------------|
| `addVisitRecord` then `getAllVisits` | record is present in results |
| `deleteVisitRecord` removes the record | `getAllVisits` returns empty after delete |
| `getVisitsByPlaceId` | returns only records matching that `placeId` |

**Isolation strategy:** `db.ts` holds a module-level singleton `dbPromise`. `fake-indexeddb/auto` installs a single shared global `indexedDB`, so simply re-importing `db.ts` via `vi.resetModules()` is not sufficient — reopening the same named database would still contain records from previous tests. Each test must:
1. Call `vi.resetModules()` in `beforeEach` and dynamically re-import `db.ts` to reset `dbPromise`
2. Call `indexedDB.deleteDatabase('eatwhat-db')` in `afterEach` to wipe the in-memory store

This combination ensures each test starts with a clean database.

### `placesService.ts` — 5 tests
| Test | Status | Notes |
|------|--------|-------|
| `placeToRestaurant` maps all fields correctly, returns `null` for missing `place_id`/`name`/`geometry` | baseline | stub a minimal `PlaceResult` via `mockPlaces.ts` |
| `parsePriceLevel`: `undefined→null`, `0→0`, `4→4` (one `it` block, three assertions) | baseline | |
| `fetchNearbyRestaurants` with two cuisines returning overlapping `placeId`s deduplicates results | baseline | deduplication already implemented via `Set<string>` — confirms it works |
| `fetchNearbyRestaurants` with empty `cuisines` array returns results | baseline | |
| `getPhotoUrl` returns `null` when `place.photos` is empty | baseline | |

`mockPlaces.ts` stubs `google.maps.places.PlacesService` with a factory that accepts mock `PlaceResult` arrays. The stub's `nearbySearch` calls its callback synchronously with `OK` status, making tests fully deterministic without async overhead.

---

## 5. Bug Fixes Triggered by Tests

No failing tests are anticipated from this test suite — all current behaviour in the tested modules is correct. If a test unexpectedly fails during implementation, fix the production code as part of the same TDD cycle before moving to the next test.

---

## 6. Out of Scope

- React hooks (`use*.ts`) — deferred to a future phase
- Component tests — deferred
- E2E tests — not planned
- Code quality issues not covered by these tests (race conditions, missing error boundaries, etc.) — separate concern

---

## 7. Success Criteria

- `npm run test:run` passes with 15 tests across 5 test files
- `npm run test:coverage` shows ≥80% line coverage on the 5 tested source files
- No production behaviour is changed except exporting 3 private functions from `placesService.ts`
