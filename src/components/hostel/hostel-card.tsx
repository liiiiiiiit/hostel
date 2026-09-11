'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Hostel } from '@/lib/types'
import { MapPin, Heart } from 'lucide-react'
import { useState } from 'react'
import { RatingBadge, ratingLabel } from './rating-badge'


const TYPE_LABELS: Record<string, string> = {
  backpacker: 'Backpacker',
  boutique: 'Boutique',
  party: 'Party',
  chill: 'Chill',
}

interface HostelCardProps {
  hostel: Hostel
  onSelect?: (slug: string) => void
}

export function HostelCard({ hostel, onSelect }: HostelCardProps) {
  const [liked, setLiked] = useState(false)

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`View ${hostel.name}`}
      onClick={() => onSelect?.(hostel.slug)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(hostel.slug)
        }
      }}
      className="group cursor-pointer overflow-hidden pt-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hostel.images[0]}
          alt={`${hostel.name} in ${hostel.city}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge
          className={cn(
            'absolute top-3 left-3 border-none text-foreground shadow-sm',
            'bg-background/90 backdrop-blur'
          )}
        >
          {TYPE_LABELS[hostel.type] ?? hostel.type}
        </Badge>
        <button
          type="button"
          aria-label={liked ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={liked}
          onClick={(e) => {
            e.stopPropagation()
            setLiked((v) => !v)
          }}
          className="absolute top-2.5 right-2.5 rounded-full bg-background/80 p-2 shadow-sm backdrop-blur transition hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Heart
            className={cn('size-4 transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-foreground')}
          />
        </button>
      </div>

      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold">{hostel.name}</h3>
          <RatingBadge rating={hostel.rating} size="sm" />
        </div>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">
            {hostel.city}, {hostel.country} · {hostel.distanceToCenter} km to center
          </span>
        </p>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{ratingLabel(hostel.rating)}</span>
          <span aria-hidden>·</span>
          <span>{hostel.reviewCount} reviews</span>
          {hostel.amenities.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <span className="line-clamp-1">{hostel.amenities.slice(0, 3).join(', ')}</span>
            </>
          )}
        </p>

        <div className="mt-1 flex items-end justify-between border-t pt-3">
          {hostel.freeCancellation ? (
            <span className="text-xs font-medium text-emerald-700">Free cancellation</span>
          ) : (
            <span className="text-xs text-muted-foreground">{hostel.breakfastIncluded ? 'Breakfast included' : ''}</span>
          )}
          <p className="text-lg leading-none font-bold text-primary">
            ${hostel.priceFrom}
            <span className="ml-1 text-xs font-normal text-muted-foreground">/ night</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
