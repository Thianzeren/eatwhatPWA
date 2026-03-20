import { useState } from 'react'
import type { VisitRecord } from '../../types'
import { StarRating } from '../result/StarRating'

interface HistoryCardProps {
  visit: VisitRecord
  onDelete: (id: string) => void
}

function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function HistoryCard({ visit, onDelete }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { restaurant } = visit

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div
        className="flex gap-3 p-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          {restaurant.photoUrl ? (
            <img
              src={restaurant.photoUrl}
              alt={restaurant.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-2xl">
              🍽️
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">
            {restaurant.name}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(visit.visitedAt)}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {visit.rating !== null && (
              <StarRating rating={visit.rating} size="sm" />
            )}
            {visit.wouldVisitAgain !== null && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  visit.wouldVisitAgain
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                }`}
              >
                {visit.wouldVisitAgain ? 'Would visit again' : 'Wouldn\'t revisit'}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div className="flex-shrink-0 flex items-center">
          <svg
            className={`w-4 h-4 text-gray-300 dark:text-gray-600 transition-transform ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-gray-50 dark:border-gray-800 pt-3">
          {visit.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{visit.notes}</p>
          )}
          <div className="flex items-center justify-between">
            <a
              href={restaurant.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline underline-offset-2"
            >
              Open in Maps
            </a>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">Delete this visit?</span>
                <button
                  onClick={() => onDelete(visit.id)}
                  className="text-xs text-red-600 font-medium"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-gray-500 dark:text-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-red-400 font-medium hover:text-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
