interface LocationPermissionPromptProps {
  onRequestLocation: () => void
  isDenied?: boolean
}

export function LocationPermissionPrompt({
  onRequestLocation,
  isDenied = false,
}: LocationPermissionPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-4">
      <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-orange-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </div>

      {isDenied ? (
        <>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Location access denied</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            EatWhat needs your location to find nearby restaurants. Please enable
            location access in your browser settings, then reload the page.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Where are you?</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            EatWhat uses your location to find great restaurants nearby. Your
            location is never stored or shared.
          </p>
          <button
            onClick={onRequestLocation}
            className="mt-2 w-full max-w-xs py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl font-semibold transition-colors"
          >
            Allow Location Access
          </button>
        </>
      )}
    </div>
  )
}
