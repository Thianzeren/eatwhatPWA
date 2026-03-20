import { useState } from 'react'

interface StarInputProps {
  value: number | null
  onChange: (rating: number | null) => void
}

export function StarInput({ value, onChange }: StarInputProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hovered !== null ? star <= hovered : value !== null && star <= value
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(value === star ? null : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            className={`text-3xl transition-colors ${active ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} hover:text-yellow-300`}
          >
            ★
          </button>
        )
      })}
      {value !== null && (
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{value}/5</span>
      )}
    </div>
  )
}
