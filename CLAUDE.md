# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

Tests (once `feature/fastapi-backend` merges):

```bash
npm run test          # Vitest watch mode
npm run test:run      # Single run
npm run test:coverage # Coverage report
```

## Environment Setup

Copy `.env.example` to `.env` and provide a Google Maps API key:

```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

The app requires the **Places API** and **Maps JavaScript API** to be enabled on that key.

## Architecture

**EatWhat** is a PWA that uses the user's geolocation to randomly pick a nearby restaurant from the Google Places API.

### View Routing

There is no React Router or Next.js. `App.tsx` holds `activeView: 'spin' | 'history'` state. `BottomNav` switches between views by updating this state.

### Data Flow

1. `useGeolocation` — gets browser geolocation coords
2. `usePlaces` — initializes `google.maps.places.PlacesService` (needs a DOM map element)
3. `useRestaurantSpin` — orchestrates a spin: calls `placesService.ts` → Google Places nearby search with active filters → picks a random result from the batch → returns the selected restaurant
4. User marks a restaurant as visited via `ReviewModal` → written to IndexedDB via `services/db.ts`
5. `useVisitHistory` — reads/updates/deletes visit history from IndexedDB
6. `useFilters` — filter state (radius, cuisine, price, openNow) persisted to `localStorage`

### Key Layers

| Layer | Files | Responsibility |
|---|---|---|
| Services | `services/placesService.ts`, `services/db.ts` | External API calls (Google Places) and IndexedDB CRUD |
| Hooks | `hooks/use*.ts` | Stateful logic consumed by components |
| Constants | `constants/index.ts` | Cuisine list, radius options, price levels |
| Types | `types/index.ts` | Shared TypeScript interfaces |

### Persistence

- **localStorage** — filter preferences (`useFilters`)
- **IndexedDB** (via `idb` package) — visit history with ratings and notes (`services/db.ts`)
- **No backend** — fully client-side

### Styling

Tailwind CSS with class-based dark mode. Brand color is orange (`#F97316` / `orange-500`). Dark mode is toggled via `useDarkMode` which adds/removes the `dark` class on `<html>`.

### PWA / Service Worker

Configured in `vite.config.ts` with `vite-plugin-pwa`. Maps API calls use `NetworkOnly` strategy (no caching). Static assets use the default precaching strategy.

### TypeScript

Strict mode is on (`noUnusedLocals`, `noUnusedParameters`). Target is ES2020. Do not leave unused imports or variables.

## Branching — Trunk-Based Development

`main` is the trunk and must always be deployable. All work goes through short-lived branches.

**Rules:**
- Branch off `main`, merge back within **1-2 days** — never let a branch live longer
- Branch names: `fix/`, `feat/`, `chore/` prefix (e.g. `feat/add-cuisine-filter`)
- Before opening a PR: rebase onto latest `main`, confirm lint + build + tests pass locally
- CI (GitHub Actions) runs lint, build, and tests on every push and PR to `main`
- `main` is protected: CI must pass before merging

**Large features** that take longer than 2 days should be built behind a feature flag so they can land on `main` incrementally without breaking the app.
