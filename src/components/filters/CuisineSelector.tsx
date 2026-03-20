import { CUISINE_OPTIONS } from '../../constants'

interface CuisineSelectorProps {
  selected: string[]
  onToggle: (cuisine: string) => void
}

export function CuisineSelector({ selected, onToggle }: CuisineSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CUISINE_OPTIONS.map((cuisine) => {
        const isActive = selected.includes(cuisine)
        return (
          <button
            key={cuisine}
            onClick={() => onToggle(cuisine)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              isActive
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600'
            }`}
          >
            {cuisine}
          </button>
        )
      })}
    </div>
  )
}
