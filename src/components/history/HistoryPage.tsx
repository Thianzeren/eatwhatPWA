import type { UseVisitHistoryReturn } from '../../hooks/useVisitHistory'
import { HistoryCard } from './HistoryCard'
import { EmptyHistory } from './EmptyHistory'
import { LoadingSpinner } from '../feedback/LoadingSpinner'

interface HistoryPageProps {
  historyControls: UseVisitHistoryReturn
}

export function HistoryPage({ historyControls }: HistoryPageProps) {
  const { visits, deleteVisit, isLoading } = historyControls

  if (isLoading) return <LoadingSpinner />

  if (visits.length === 0) return <EmptyHistory />

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">
        {visits.length} visit{visits.length !== 1 ? 's' : ''}
      </p>
      {visits.map((visit) => (
        <HistoryCard key={visit.id} visit={visit} onDelete={deleteVisit} />
      ))}
    </div>
  )
}
