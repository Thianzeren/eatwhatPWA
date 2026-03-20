import type { Restaurant } from '../../types'
import { RestaurantPhoto } from './RestaurantPhoto'
import { StarRating } from './StarRating'
import { PriceRating } from './PriceRating'
import { MapsLink } from './MapsLink'
import { MarkVisitedButton } from './MarkVisitedButton'
import { formatDistance } from '../../utils/distance'

interface RestaurantCardProps {
  restaurant: Restaurant
  alreadyVisited: boolean
  onSpinAgain: () => void
  onMarkVisited: () => void
}

function formatCuisineTypes(types: string[]): string {
  return types
    .slice(0, 3)
    .map((t) =>
      t
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    )
    .join(' · ')
}

export function RestaurantCard({
  restaurant,
  alreadyVisited,
  onSpinAgain,
  onMarkVisited,
}: RestaurantCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden mx-4">
      <RestaurantPhoto photoUrl={restaurant.photoUrl} name={restaurant.name} />

      <div className="p-4 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {restaurant.name}
          </h2>
          {restaurant.cuisineTypes.length > 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {formatCuisineTypes(restaurant.cuisineTypes)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {restaurant.rating !== null && (
            <div className="flex items-center gap-1">
              <StarRating rating={restaurant.rating} size="sm" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {restaurant.rating.toFixed(1)}
                {restaurant.userRatingsTotal !== null && (
                  <span className="text-gray-400 dark:text-gray-500">
                    {' '}({restaurant.userRatingsTotal.toLocaleString()})
                  </span>
                )}
              </span>
            </div>
          )}
          {restaurant.priceLevel !== null && (
            <PriceRating priceLevel={restaurant.priceLevel} />
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <span>{formatDistance(restaurant.distanceMeters)}</span>
          {restaurant.openNow !== null && (
            <>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className={restaurant.openNow ? 'text-green-600' : 'text-red-500'}>
                {restaurant.openNow ? 'Open now' : 'Closed'}
              </span>
            </>
          )}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-sm">{restaurant.vicinity}</p>

        <MapsLink mapsUrl={restaurant.mapsUrl} />

        <div className="flex gap-3 pt-1">
          <button
            onClick={onSpinAgain}
            className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Spin Again
          </button>
          <MarkVisitedButton alreadyVisited={alreadyVisited} onClick={onMarkVisited} />
        </div>
      </div>
    </div>
  )
}
