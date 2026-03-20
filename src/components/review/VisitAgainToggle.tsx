interface VisitAgainToggleProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
}

export function VisitAgainToggle({ value, onChange }: VisitAgainToggleProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChange(value === true ? null : true)}
        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
          value === true
            ? 'bg-green-100 dark:bg-green-900/40 border-green-400 text-green-700 dark:text-green-400'
            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(value === false ? null : false)}
        className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
          value === false
            ? 'bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-400'
            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        No
      </button>
    </div>
  )
}
