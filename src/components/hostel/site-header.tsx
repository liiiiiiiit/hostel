'use client'

import { Button } from '@/components/ui/button'
import { useWorldHostel } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Globe2, Luggage, Ticket } from 'lucide-react'

export function SiteHeader() {
  const { view, navigate, guestSearch } = useWorldHostel()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="WorldHostel home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Globe2 className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-lg font-bold tracking-tight">WorldHostel</span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              Sleep cheap. Travel far.
            </span>
          </span>
        </button>

        <nav aria-label="Main navigation" className="flex items-center gap-1 sm:gap-2">
          <Button
            variant={view === 'home' || view === 'search' ? 'secondary' : 'ghost'}
            onClick={() => navigate('home')}
            className="gap-2"
            aria-current={view === 'home' || view === 'search' ? 'page' : undefined}
          >
            <Luggage className="size-4" aria-hidden />
            <span className="hidden sm:inline">Explore</span>
          </Button>
          <Button
            variant={view === 'bookings' ? 'secondary' : 'ghost'}
            onClick={() => navigate('bookings')}
            className="relative gap-2"
            aria-current={view === 'bookings' ? 'page' : undefined}
          >
            <Ticket className="size-4" aria-hidden />
            <span className="hidden sm:inline">My bookings</span>
            {guestSearch.destination && view === 'bookings' && (
              <span className={cn('absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary')} aria-hidden />
            )}
          </Button>
        </nav>
      </div>
    </header>
  )
}
