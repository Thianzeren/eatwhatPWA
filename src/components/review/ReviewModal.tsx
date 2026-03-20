import { useState, useEffect } from 'react'
import type { Restaurant } from '../../types'
import { StarInput } from './StarInput'
import { VisitAgainToggle } from './VisitAgainToggle'

interface ReviewModalProps {
  restaurant: Restaurant
  onSave: (review: {
    rating: number | null
    notes: string
    wouldVisitAgain: boolean | null
  }) => void
  onClose: () => void
}

export function ReviewModal({ restaurant, onSave, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [wouldVisitAgain, setWouldVisitAgain] = useState<boolean | null>(null)

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  function handleSave() {
    onSave({ rating, notes, wouldVisitAgain })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl px-5 pt-4 pb-8 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Handle */}
        <div className="mx-auto w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />

        <div className="flex items-start justify-between">
          <div>
            <h2 id="review-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
              Log Visit
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{restaurant.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Your Rating (optional)
          </label>
          <StarInput value={rating} onChange={setRating} />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="review-notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes (optional)
          </label>
          <textarea
            id="review-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you order? How was it?"
            rows={3}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Would visit again?
          </label>
          <VisitAgainToggle value={wouldVisitAgain} onChange={setWouldVisitAgain} />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl font-semibold text-base transition-colors"
        >
          Save Visit
        </button>
      </div>
    </div>
  )
}
