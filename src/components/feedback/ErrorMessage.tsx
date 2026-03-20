interface ErrorMessageProps {
  message: string | null
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="mx-4 mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-2xl text-center space-y-3">
      <p className="text-2xl">😕</p>
      <p className="text-red-700 font-medium text-sm">
        {message ?? 'Something went wrong.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-orange-600 font-semibold text-sm underline underline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  )
}
