interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md'
}

export function StarRating({ rating, max = 5, size = 'md' }: StarRatingProps) {
  const textSize = size === 'sm' ? 'text-sm' : 'text-base'
  const stars = []

  for (let i = 1; i <= max; i++) {
    const fill = Math.min(1, Math.max(0, rating - (i - 1)))
    let starClass = 'text-gray-300 dark:text-gray-600'
    if (fill >= 0.75) starClass = 'text-yellow-400'
    else if (fill >= 0.25) starClass = 'text-yellow-300'
    stars.push(
      <span key={i} className={starClass}>
        ★
      </span>,
    )
  }

  return (
    <span className={`inline-flex items-center ${textSize}`} aria-label={`${rating} out of ${max} stars`}>
      {stars}
    </span>
  )
}
