'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWorldHostel } from '@/lib/store'
import { cn } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { CalendarDays, MapPin, Search, Users } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  variant?: 'hero' | 'compact'
  className?: string
  onSearched?: () => void
}

export function SearchBar({ variant = 'hero', className, onSearched }: SearchBarProps) {
  const { guestSearch, searchDestination } = useWorldHostel()
  const [destination, setDestination] = useState(guestSearch.destination)
  const [checkIn, setCheckIn] = useState(guestSearch.checkIn)
  const [checkOut, setCheckOut] = useState(guestSearch.checkOut)
  const [guests, setGuests] = useState(guestSearch.guests)

  const isHero = variant === 'hero'
  const today = format(new Date(), 'yyyy-MM-dd')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    let co = checkOut
    if (co <= checkIn) co = format(addDays(new Date(checkIn), 1), 'yyyy-MM-dd')
    searchDestination(destination)
    useWorldHostel.getState().setGuestSearch({ checkIn, checkOut: co, guests })
    onSearched?.()
  }

  const fieldClass = cn(
    'h-12 rounded-xl border-input bg-background text-sm',
    isHero && 'h-12'
  )

  return (
    <form
      role="search"
      aria-label="Search hostels"
      onSubmit={submit}
      className={cn(
        'grid w-full gap-3',
        isHero
          ? 'rounded-2xl bg-card/95 p-4 shadow-xl backdrop-blur md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] md:items-end md:gap-2 md:rounded-2xl md:p-3'
          : 'md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] md:items-end md:gap-2',
        className
      )}
    >
      <div className="relative">
        <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          aria-label="Destination"
          placeholder="City, country, or hostel name…"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className={cn(fieldClass, 'pl-9')}
        />
      </div>

      <label className="relative">
        <span className="sr-only">Check-in date</span>
        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="date"
          aria-label="Check-in date"
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className={cn(fieldClass, 'pl-9')}
        />
      </label>

      <label className="relative">
        <span className="sr-only">Check-out date</span>
        <CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="date"
          aria-label="Check-out date"
          min={checkIn}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className={cn(fieldClass, 'pl-9')}
        />
      </label>

      <label className="relative">
        <span className="sr-only">Number of guests</span>
        <Users className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Select value={String(guests)} onValueChange={(v) => setGuests(Number(v))}>
          <SelectTrigger aria-label="Number of guests" className={cn(fieldClass, 'w-full pl-9')}>
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
      </label>

      <Button
        type="submit"
        size="lg"
        className="h-12 rounded-xl px-6 font-semibold shadow-md"
        aria-label="Search for hostels"
      >
        <Search className="size-4" aria-hidden />
        Search
      </Button>
    </form>
  )
}
