import { useState } from 'react'
import type { AppView } from './types'
import { useRestaurantSpin } from './hooks/useRestaurantSpin'
import { useVisitHistory } from './hooks/useVisitHistory'
import { useDarkMode } from './hooks/useDarkMode'

import { Header } from './components/layout/Header'
import { BottomNav } from './components/layout/BottomNav'
import { FilterPanel } from './components/filters/FilterPanel'
import { SpinButton } from './components/spin/SpinButton'
import { LoadingSpinner } from './components/feedback/LoadingSpinner'
import { ErrorMessage } from './components/feedback/ErrorMessage'
import { NoResultsMessage } from './components/feedback/NoResultsMessage'
import { LocationPermissionPrompt } from './components/feedback/LocationPermissionPrompt'
import { RestaurantCard } from './components/result/RestaurantCard'
import { ReviewModal } from './components/review/ReviewModal'
import { HistoryPage } from './components/history/HistoryPage'

export function App() {
  const [activeView, setActiveView] = useState<AppView>('spin')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const { isDark, toggle: toggleDark } = useDarkMode()

  const {
    spinState,
    filterControls,
    geoStatus,
    retryLocation,
    spin,
    spinAgain,
  } = useRestaurantSpin()

  const historyControls = useVisitHistory()

  // Check if the current result has been visited in this session
  const currentVisits =
    spinState.result
      ? historyControls.getVisitsByPlaceId(spinState.result.placeId)
      : []
  const alreadyVisited = currentVisits.length > 0

  function handleMarkVisited() {
    setShowReviewModal(true)
  }

  function handleSaveReview(review: {
    rating: number | null
    notes: string
    wouldVisitAgain: boolean | null
  }) {
    if (!spinState.result) return
    historyControls.addVisit(spinState.result, review)
    setShowReviewModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col pb-16">
      <Header isDark={isDark} onToggleDark={toggleDark} />

      <main className="flex-1 overflow-y-auto">
        {activeView === 'spin' && (
          <div className="py-3">
            <FilterPanel filterControls={filterControls} />

            {/* State machine */}
            {geoStatus === 'denied' && (
              <LocationPermissionPrompt onRequestLocation={retryLocation} isDenied />
            )}

            {geoStatus === 'idle' && spinState.status === 'idle' && (
              <LocationPermissionPrompt onRequestLocation={spin} />
            )}

            {geoStatus === 'requesting' && spinState.status === 'idle' && (
              <LoadingSpinner />
            )}

            {(geoStatus === 'granted' || geoStatus === 'error') &&
              spinState.status === 'idle' && (
                <SpinButton onClick={spin} />
              )}

            {spinState.status === 'loading' && <LoadingSpinner />}

            {spinState.status === 'error' && (
              <div className="space-y-4">
                <ErrorMessage message={spinState.errorMessage} onRetry={spin} />
                <div className="flex justify-center">
                  <SpinButton onClick={spin} label="Try Again" />
                </div>
              </div>
            )}

            {spinState.status === 'empty' && (
              <NoResultsMessage onRetry={spin} />
            )}

            {spinState.status === 'success' && spinState.result && (
              <div className="py-2">
                <RestaurantCard
                  restaurant={spinState.result}
                  alreadyVisited={alreadyVisited}
                  onSpinAgain={spinAgain}
                  onMarkVisited={handleMarkVisited}
                />
              </div>
            )}
          </div>
        )}

        {activeView === 'history' && (
          <HistoryPage historyControls={historyControls} />
        )}
      </main>

      <BottomNav
        activeView={activeView}
        onNavigate={setActiveView}
        historyCount={historyControls.visits.length}
      />

      {showReviewModal && spinState.result && (
        <ReviewModal
          restaurant={spinState.result}
          onSave={handleSaveReview}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  )
}
