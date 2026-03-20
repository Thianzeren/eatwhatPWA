import type { AppView } from '../../types'

interface BottomNavProps {
  activeView: AppView
  onNavigate: (view: AppView) => void
  historyCount?: number
}

interface NavItem {
  view: AppView
  label: string
  icon: (active: boolean) => React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    view: 'spin',
    label: 'Spin',
    icon: (active) => (
      <svg
        className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    view: 'history',
    label: 'History',
    icon: (active) => (
      <svg
        className={`w-6 h-6 ${active ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
]

export function BottomNav({ activeView, onNavigate, historyCount }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex safe-bottom">
      {NAV_ITEMS.map((item) => {
        const isActive = activeView === item.view
        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
              isActive ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="relative">
              {item.icon(isActive)}
              {item.view === 'history' && historyCount !== undefined && historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                  {historyCount > 99 ? '99+' : historyCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
