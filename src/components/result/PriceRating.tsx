import type { PriceLevel } from '../../types'

interface PriceRatingProps {
  priceLevel: PriceLevel | null
}

export function PriceRating({ priceLevel }: PriceRatingProps) {
  if (priceLevel === null) return null
  const signs = '$'.repeat(priceLevel === 0 ? 1 : priceLevel)
  return (
    <span className="text-green-700 font-medium text-sm" aria-label={`Price: ${signs}`}>
      {signs}
    </span>
  )
}
