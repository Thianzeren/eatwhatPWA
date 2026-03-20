# TDD: Pure Logic Layer — Design Spec

**Date:** 2026-03-20
**Scope:** Install Vitest, write failing tests for the pure logic layer (utils + services), fix uncovered bugs. Hooks and components are out of scope for this phase.
**Approach:** TDD — write failing test → fix bug → green → next.

---

## 1. Setup

### Dependencies to install
```
vitest @vitest/coverage-v8 jsdom fake-indexeddb
```
`@testing-library/react` is installed but unused until a future hook-testing phase.

### `vite.config.ts` — add `test` block
```ts
test: {
  environment: 'jsdom',
  globals: true,
  coverage: { provider: 'v8', reporter: ['text', 'lcov'] }
}
```

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
    utils/
      random.test.ts
      distance.test.ts
      storage.test.ts
    services/
      db.test.ts
      placesService.test.ts
    helpers/
      mockStorage.ts     ← shared localStorage mock
      mockPlaces.ts      ← shared Google Places API stubs
```

---

## 3. Tests Per Module

All tests are written to fail against current code first, then the production code is fixed to make them pass.

### `random.ts` — 2 tests
| Test | Expectation | Current behaviour |
|------|-------------|-------------------|
| `pickRandom([])` | returns `undefined` | ✅ passes (baseline) |
| `pickRandom([a,b,c])` | returns one of the items | ✅ passes (baseline) |

No bugs to fix here. These tests serve as a regression baseline.

### `distance.ts` — 2 tests
| Test | Expectation | Current behaviour |
|------|-------------|-------------------|
| Known coordinates (Singapore CBD → Changi Airport, ~17.5 km) | result within ±0.5 km | likely ✅ |
| `formatDistance` boundaries: 999 → "999 m", 1000 → "1.0 km", 1500 → "1.5 km" | correct string format | verify |

No bugs expected. Tests serve as accuracy and formatting regression guards.

### `storage.ts` — 3 tests
| Test | Expectation | Current behaviour |
|------|-------------|-------------------|
| Round-trip: save then load returns same value | returns saved value | ✅ |
| Load with malformed JSON in localStorage | returns fallback, does not throw | ✅ (silent catch) |
| Load with missing key | returns fallback | ✅ |

No bugs to fix. Tests guard against regressions in the silent-failure paths.

### `db.ts` — 3 tests (using `fake-indexeddb`)
| Test | Expectation | Current behaviour |
|------|-------------|-------------------|
| `addVisitRecord` then `getAllVisits` returns the record | record present | likely ✅ |
| `deleteVisitRecord` removes the record | record absent after delete | likely ✅ |
| `getVisitsByPlaceId` returns only records matching that placeId | filtered results | verify |

`fake-indexeddb` replaces the real IndexedDB in the jsdom environment. No mock patching required — import `fake-indexeddb/auto` in the test setup file.

### `placesService.ts` — 5 tests (Google Maps stubbed via `mockPlaces.ts`)
| Test | Expectation | Current behaviour |
|------|-------------|-------------------|
| `placeToRestaurant` maps all fields correctly including nulls | correct Restaurant shape | verify |
| `parsePriceLevel(undefined)` → `null`; `parsePriceLevel(0)` → `0`; `parsePriceLevel(4)` → `4` | correct values | likely ✅ |
| `fetchNearbyRestaurants` with two cuisines that return overlapping placeIds deduplicates results | unique results only | **fails** — bug exists |
| `fetchNearbyRestaurants` with empty cuisines array returns results | results returned | verify |
| `getPhotoUrl` returns `null` when place has no photos | `null` | verify |

**Bug to fix:** Deduplication across multi-cuisine queries. When multiple cuisine keywords are searched, the same place can appear in multiple results. Current code does not reliably deduplicate. Fix: collect all results, deduplicate by `placeId` before returning.

---

## 4. Shared Test Helpers

### `mockStorage.ts`
Wraps `vi.stubGlobal` / `vi.spyOn` to replace `localStorage` with an in-memory map. Provides `setup()` and `teardown()` functions called in `beforeEach`/`afterEach`.

### `mockPlaces.ts`
Stubs `google.maps.places.PlacesService` with a factory that accepts a list of mock `PlaceResult` objects. The stub's `nearbySearch` calls the callback synchronously with `OK` status, enabling deterministic tests without async complexity.

---

## 5. Bug Fixes Triggered by Tests

| File | Bug | Fix |
|------|-----|-----|
| `placesService.ts` | Multi-cuisine results not deduplicated by `placeId` | Collect all results into a `Map<placeId, Place>`, spread to array before returning |

All other tests are expected to pass against current code (regression baselines) or reveal no bugs. If additional bugs surface during implementation, fix them as part of the same TDD cycle.

---

## 6. Out of Scope

- React hooks (`use*.ts`) — deferred to a future phase using `@testing-library/react`
- Component tests — deferred
- E2E tests — not planned
- Code quality issues that are not caught by the 15 tests above (race conditions, missing error boundaries, etc.) — separate concern

---

## 7. Success Criteria

- `npm run test:run` passes with 15 tests across 5 test files
- `npm run test:coverage` shows ≥80% coverage on the 5 tested files
- No existing production behaviour is changed except the deduplication bug fix
