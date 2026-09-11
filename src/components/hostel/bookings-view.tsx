'use client'

import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetchBookings } from '@/lib/api'
import { useWorldHostel } from '@/lib/store'
import { CircleCheck, Loader2, Luggage, Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function BookingsView() {
  const { bookingEmail, setBookingEmail, navigate } = useWorldHostel()
  const [emailInput, setEmailInput] = useState(bookingEmail)
  const [searchedEmail, setSearchedEmail] = useState(bookingEmail)

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['bookings', searchedEmail],
    queryFn: () => fetchBookings(searchedEmail),
    enabled: searchedEmail !== '' && EMAIL_RE.test(searchedEmail),
  })

  function lookup(e: React.FormEvent) {
    e.preventDefault()
    const email = emailInput.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    setBookingEmail(email)
    setSearchedEmail(email)
  }

  const bookings = data?.bookings ?? []

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the email you booked with to find your stays and booking codes.
      </p>

      <form
        onSubmit={lookup}
        role="search"
        aria-label="Find bookings by email"
        className="mt-6 flex flex-col gap-2 sm:flex-row"
      >
        <Input
          type="email"
          placeholder="you@example.com"
          aria-label="Booking email address"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="h-12 flex-1 rounded-xl"
        />
        <Button type="submit" size="lg" className="h-12 rounded-xl px-6 font-semibold">
          <Search className="size-4" aria-hidden /> Find my bookings
        </Button>
      </form>

      {isLoading && (
        <div className="mt-8 flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden /> Loading your bookings…
        </div>
      )}

      {!isLoading && searchedEmail && isFetched && bookings.length === 0 && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
              <Luggage className="size-7 text-muted-foreground" aria-hidden />
            </span>
            <h3 className="text-lg font-semibold">No bookings yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              We couldn&apos;t find any stays for <span className="font-medium">{searchedEmail}</span>.
              Time to fix that — your next hostel is a couple of clicks away.
            </p>
            <Button onClick={() => navigate('search')} className="mt-2">
              Browse hostels
            </Button>
          </CardContent>
        </Card>
      )}

      {bookings.length > 0 && (
        <div className="mt-8 flex flex-col gap-4" aria-live="polite">
          <p className="text-sm text-muted-foreground">
            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} for{' '}
            <span className="font-medium text-foreground">{searchedEmail}</span>
          </p>
          {bookings.map((b) => (
            <Card key={b.id} className="overflow-hidden">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:p-4">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-44">
                  <img
                    src={b.hostel.images[0]}
                    alt={`${b.hostel.name}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{b.hostel.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {b.hostel.city}, {b.hostel.country}
                      </p>
                    </div>
                    <Badge className="gap-1 border-none bg-emerald-600 text-white">
                      <CircleCheck className="size-3" aria-hidden /> {b.status}
                    </Badge>
                  </div>

                  <div className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                    <p className="text-muted-foreground">
                      <span className="text-foreground">{b.room.name}</span>{' '}
                      <span className="text-xs">({b.room.type})</span>
                    </p>
                    <p className="text-muted-foreground">
                      {b.checkIn} → {b.checkOut} · {b.nights}{' '}
                      {b.nights === 1 ? 'night' : 'nights'}
                    </p>
                    <p className="text-muted-foreground">
                      {b.guests} {b.guests === 1 ? 'guest' : 'guests'} · {b.guestName}
                    </p>
                    <p className="text-muted-foreground">
                      Booked{' '}
                      {new Date(b.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                    <span className="rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 px-3 py-1 font-mono text-sm font-bold tracking-wider text-primary">
                      {b.code}
                    </span>
                    <p className="font-bold">
                      <span className="text-muted-foreground">Total </span>${b.totalPrice}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!searchedEmail && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
              <Search className="size-7 text-muted-foreground" aria-hidden />
            </span>
            <h3 className="text-lg font-semibold">Looking for a booking?</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Enter your email above and we&apos;ll pull up all your stays, codes and
              cancellation options.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
