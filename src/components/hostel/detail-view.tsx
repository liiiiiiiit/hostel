'use client'

import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchHostelDetail } from '@/lib/api'
import { useWorldHostel } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  BedDouble,
  Check,
  ChevronLeft,
  Coffee,
  MapPin,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { BookingDialog } from './booking-dialog'
import { RatingBadge, ratingLabel } from './rating-badge'


const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'Free WiFi': Check,
  Breakfast: Coffee,
  Bar: Coffee,
  'Shared Kitchen': Check,
  Lockers: Check,
  'Air Conditioning': Check,
  Laundry: Check,
  'Rooftop Terrace': Check,
  'Luggage Storage': Check,
  '24/7 Reception': Check,
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function DetailView() {
  const { selectedSlug, guestSearch, setGuestSearch, navigate } = useWorldHostel()
  const [activeImage, setActiveImage] = useState(0)
  const [bookingRoom, setBookingRoom] = useState<string | null>(null)

  const { data: hostel, isLoading, isError } = useQuery({
    queryKey: ['hostel', selectedSlug],
    queryFn: () => fetchHostelDetail(selectedSlug!),
    enabled: !!selectedSlug,
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Skeleton className="mb-4 h-8 w-64" />
        <div className="grid gap-3 sm:grid-cols-4">
          <Skeleton className="aspect-[4/3] sm:col-span-2 sm:row-span-2" />
          <Skeleton className="aspect-[4/3]" />
          <Skeleton className="aspect-[4/3]" />
          <Skeleton className="aspect-[4/3]" />
          <Skeleton className="aspect-[4/3]" />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (isError || !hostel) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Hostel not found</h1>
        <p className="text-muted-foreground">
          This one seems to have checked out. Let&apos;s find you another bed.
        </p>
        <Button onClick={() => navigate('search')} className="gap-2">
          <ArrowLeft className="size-4" aria-hidden /> Back to search
        </Button>
      </div>
    )
  }

  const images = hostel.images.length > 0 ? hostel.images : ['']
  const main = images[Math.min(activeImage, images.length - 1)]
  const selectedRoom = hostel.rooms.find((r) => r.id === bookingRoom) ?? null

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Breadcrumb / back */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => navigate('search')} className="gap-1 pl-2">
          <ChevronLeft className="size-4" aria-hidden /> Back to results
        </Button>
      </div>

      {/* Title */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{hostel.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {hostel.address}
            <span aria-hidden>·</span>
            {hostel.distanceToCenter} km to center
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold">{ratingLabel(hostel.rating)}</p>
            <p className="text-xs text-muted-foreground">{hostel.reviewCount} reviews</p>
          </div>
          <RatingBadge rating={hostel.rating} size="lg" />
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-8 grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
        <div className="relative overflow-hidden rounded-2xl sm:col-span-2 sm:row-span-2">
          <img
            src={main}
            alt={`Photo of ${hostel.name} — view ${activeImage + 1}`}
            className="aspect-[4/3] size-full object-cover sm:aspect-auto sm:h-full"
          />
          <Badge className="absolute top-3 left-3 border-none bg-background/90 text-foreground backdrop-blur capitalize">
            {hostel.type} hostel
          </Badge>
        </div>
        {images.slice(1, 5).map((img, i) => (
          <button
            key={img + i}
            type="button"
            onClick={() => setActiveImage(i + 1)}
            aria-label={`Show photo ${i + 2}`}
            className={cn(
              'relative hidden overflow-hidden rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:block',
              activeImage === i + 1 && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            <img
              src={img}
              alt={`${hostel.name} photo ${i + 2}`}
              loading="lazy"
              className="aspect-[4/3] size-full object-cover transition hover:scale-105"
            />
          </button>
        ))}
        {/* Mobile thumbnails */}
        <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {images.slice(1, 6).map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActiveImage(i + 1)}
              aria-label={`Show photo ${i + 2}`}
              className={cn(
                'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg',
                activeImage === i + 1 && 'ring-2 ring-primary ring-offset-1'
              )}
            >
              <img src={img} alt="" loading="lazy" className="size-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="flex flex-col gap-8">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="mb-3 text-xl font-bold tracking-tight">
              About this hostel
            </h2>
            <p className="leading-relaxed text-muted-foreground">{hostel.longDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hostel.freeCancellation && (
                <Badge variant="outline" className="gap-1 border-emerald-300 text-emerald-700">
                  <Check className="size-3" aria-hidden /> Free cancellation
                </Badge>
              )}
              {hostel.breakfastIncluded && (
                <Badge variant="outline" className="gap-1 border-amber-300 text-amber-700">
                  <Coffee className="size-3" aria-hidden /> Breakfast included
                </Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {hostel.type} vibe
              </Badge>
            </div>
          </section>

          <section aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className="mb-3 text-xl font-bold tracking-tight">
              Amenities
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
              {hostel.amenities.map((amenity) => {
                const Icon = AMENITY_ICONS[amenity] ?? Check
                return (
                  <li key={amenity} className="flex items-center gap-2 text-sm">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    {amenity}
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="location-heading">
            <h2 id="location-heading" className="mb-3 text-xl font-bold tracking-tight">
              Location
            </h2>
            <Card>
              <CardContent className="flex flex-col gap-2 p-5">
                <p className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="font-medium">{hostel.address}</span>
                    <span className="block text-muted-foreground">
                      {hostel.city}, {hostel.country} · {hostel.distanceToCenter} km from the
                      city center — walking distance to the main sights, bars and transit.
                    </span>
                  </span>
                </p>
                <div className="mt-1 flex h-28 items-center justify-center rounded-xl bg-secondary/70 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" aria-hidden />
                    {hostel.city} city center — {hostel.distanceToCenter} km away
                  </span>
                </div>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="reviews-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="reviews-heading" className="text-xl font-bold tracking-tight">
                Traveler reviews
              </h2>
              <div className="flex items-center gap-2">
                <RatingBadge rating={hostel.rating} />
                <span className="text-sm text-muted-foreground">{hostel.reviewCount} reviews</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {hostel.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="flex flex-col gap-2 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
                          {initials(review.author)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{review.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {review.country} ·{' '}
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <RatingBadge rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      “{review.comment}”
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right column — booking panel */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-baseline justify-between">
                <p>
                  <span className="text-2xl font-bold text-primary">${hostel.priceFrom}</span>
                  <span className="ml-1 text-sm text-muted-foreground">/ night</span>
                </p>
                <RatingBadge rating={hostel.rating} size="sm" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="detail-checkin" className="text-xs text-muted-foreground">
                    Check-in
                  </Label>
                  <Input
                    id="detail-checkin"
                    type="date"
                    value={guestSearch.checkIn}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setGuestSearch({ checkIn: e.target.value })}
                    className="h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="detail-checkout" className="text-xs text-muted-foreground">
                    Check-out
                  </Label>
                  <Input
                    id="detail-checkout"
                    type="date"
                    value={guestSearch.checkOut}
                    min={guestSearch.checkIn}
                    onChange={(e) => setGuestSearch({ checkOut: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">Guests</Label>
                <Select
                  value={String(guestSearch.guests)}
                  onValueChange={(v) => setGuestSearch({ guests: Number(v) })}
                >
                  <SelectTrigger aria-label="Number of guests" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <BedDouble className="size-4 text-primary" aria-hidden />
                  Choose your room
                </h3>
                {hostel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-start justify-between gap-3 rounded-xl border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{room.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="size-3" aria-hidden />
                        up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'} ·{' '}
                        {room.bedsTotal} left
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {room.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <p className="text-sm font-bold text-primary">
                        ${room.pricePerNight}
                        <span className="text-xs font-normal text-muted-foreground">/night</span>
                      </p>
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold"
                        onClick={() => setBookingRoom(room.id)}
                        aria-label={`Book ${room.name} for $${room.pricePerNight} per night`}
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BookingDialog
        hostel={hostel}
        room={selectedRoom}
        open={bookingRoom !== null}
        onOpenChange={(open) => {
          if (!open) setBookingRoom(null)
        }}
      />
    </div>
  )
}
