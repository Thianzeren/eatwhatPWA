export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-12 h-12 rounded-full border-4 border-orange-200 dark:border-orange-900 border-t-orange-500 animate-spin"
        role="status"
        aria-label="Loading"
      />
      <p className="text-gray-400 dark:text-gray-500 text-sm">Finding restaurants near you…</p>
    </div>
  )
}
