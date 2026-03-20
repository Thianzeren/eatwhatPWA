interface RestaurantPhotoProps {
  photoUrl: string | null
  name: string
}

export function RestaurantPhoto({ photoUrl, name }: RestaurantPhotoProps) {
  if (!photoUrl) {
    return (
      <div className="w-full h-48 bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center rounded-t-2xl">
        <span className="text-5xl" role="img" aria-label="food">
          🍽️
        </span>
      </div>
    )
  }

  return (
    <img
      src={photoUrl}
      alt={name}
      className="w-full h-48 object-cover rounded-t-2xl"
      loading="lazy"
    />
  )
}
