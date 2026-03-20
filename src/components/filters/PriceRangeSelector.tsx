import type { PriceLevel } from '../../types'
import { PRICE_LEVEL_LABELS } from '../../constants'

interface PriceRangeSelectorProps {
  selected: PriceLevel[]
  onToggle: (level: PriceLevel) => void
}

const PRICE_LEVELS: PriceLevel[] = [1, 2, 3, 4]

export function PriceRangeSelector({ selected, onToggle }: PriceRangeSelectorProps) {
  return (
    <div className="flex gap-2">
      {PRICE_LEVELS.map((level) => {
        const isActive = selected.includes(level)
        return (
          <button
            key={level}
            onClick={() => onToggle(level)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
              isActive
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600'
            }`}
          >
            {PRICE_LEVEL_LABELS[level]}
          </button>
        )
      })}
    </div>
  )
}
