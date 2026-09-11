'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface RatingBadgeProps {
  rating: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showStar?: boolean
}

export function ratingColor(rating: number): string {
  if (rating >= 9) return 'bg-emerald-600'
  if (rating >= 8) return 'bg-lime-600'
  return 'bg-amber-500'
}

export function ratingLabel(rating: number): string {
  if (rating >= 9.3) return 'Exceptional'
  if (rating >= 9) return 'Superb'
  if (rating >= 8.5) return 'Fabulous'
  if (rating >= 8) return 'Very good'
  if (rating >= 7) return 'Good'
  return 'Pleasant'
}

export function RatingBadge({ rating, className, size = 'md', showStar = false }: RatingBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-lg font-semibold text-white shadow-sm',
        ratingColor(rating),
        size === 'sm' && 'h-6 min-w-6 px-1.5 text-xs',
        size === 'md' && 'h-7 min-w-7 px-2 text-sm',
        size === 'lg' && 'h-10 min-w-10 px-2.5 text-lg',
        className
      )}
      aria-label={`Rated ${rating} out of 10`}
    >
      {showStar && <Star className="size-3 fill-white" aria-hidden />}
      {rating.toFixed(1)}
    </span>
  )
}
