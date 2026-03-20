interface OpenNowToggleProps {
  value: boolean
  onChange: (v: boolean) => void
}

export function OpenNowToggle({ value, onChange }: OpenNowToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      <span className="sr-only">Open now only</span>
    </button>
  )
}
