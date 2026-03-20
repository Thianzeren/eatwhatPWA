import type { RadiusMeters } from '../../types'
import { RADIUS_OPTIONS } from '../../constants'

interface RadiusSelectorProps {
  value: RadiusMeters
  onChange: (r: RadiusMeters) => void
}

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div className="flex gap-2">
      {RADIUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
            value === opt.value
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
