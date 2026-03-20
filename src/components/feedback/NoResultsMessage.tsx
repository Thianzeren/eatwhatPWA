interface NoResultsMessageProps {
  onRetry: () => void
}

export function NoResultsMessage({ onRetry }: NoResultsMessageProps) {
  return (
    <div className="mx-4 mt-6 p-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900 rounded-2xl text-center space-y-3">
      <p className="text-3xl">🍽️</p>
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">No restaurants found</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Try increasing the radius or adjusting your filters.
      </p>
      <button
        onClick={onRetry}
        className="text-orange-600 font-semibold text-sm underline underline-offset-2"
      >
        Spin again
      </button>
    </div>
  )
}
