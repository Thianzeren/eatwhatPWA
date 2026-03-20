interface MarkVisitedButtonProps {
  alreadyVisited: boolean
  onClick: () => void
}

export function MarkVisitedButton({ alreadyVisited, onClick }: MarkVisitedButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
        alreadyVisited
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300'
      }`}
    >
      <span>{alreadyVisited ? '✓' : '+'}</span>
      {alreadyVisited ? 'Visited' : 'Mark Visited'}
    </button>
  )
}
