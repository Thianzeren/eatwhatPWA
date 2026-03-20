export function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-3">
      <p className="text-4xl">📋</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">No visits yet</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        Spin to find a restaurant and tap "Mark Visited" to start building your
        dining history.
      </p>
    </div>
  )
}
