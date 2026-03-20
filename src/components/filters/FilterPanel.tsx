import { useState } from 'react'
import type { UseFiltersReturn } from '../../hooks/useFilters'
import { RadiusSelector } from './RadiusSelector'
import { CuisineSelector } from './CuisineSelector'
import { OpenNowToggle } from './OpenNowToggle'
import { PriceRangeSelector } from './PriceRangeSelector'

interface FilterPanelProps {
  filterControls: UseFiltersReturn
}

export function FilterPanel({ filterControls }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { filters, setRadius, toggleCuisine, setOpenNow, togglePriceLevel, resetFilters } =
    filterControls

  const hasActiveFilters =
    filters.cuisines.length > 0 ||
    filters.priceLevels.length > 0 ||
    !filters.openNow ||
    filters.radius !== 1000

  return (
    <div className="mx-4 mb-2">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-500 text-white text-xs">
              !
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Radius
            </label>
            <RadiusSelector value={filters.radius} onChange={setRadius} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Open Now Only
              </label>
              <OpenNowToggle value={filters.openNow} onChange={setOpenNow} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Price
            </label>
            <PriceRangeSelector selected={filters.priceLevels} onToggle={togglePriceLevel} />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Cuisine
            </label>
            <CuisineSelector selected={filters.cuisines} onToggle={toggleCuisine} />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-orange-600 font-medium underline underline-offset-2"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
