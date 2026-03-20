interface SpinButtonProps {
  onClick: () => void
  disabled?: boolean
  label?: string
}

export function SpinButton({ onClick, disabled = false, label = 'SPIN!' }: SpinButtonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-36 h-36 rounded-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-2xl shadow-2xl transition-all active:scale-95 select-none"
        aria-label="Spin to find a random restaurant"
      >
        {label}
      </button>
      <p className="mt-4 text-gray-400 dark:text-gray-500 text-sm">Tap to find a random restaurant nearby</p>
    </div>
  )
}
