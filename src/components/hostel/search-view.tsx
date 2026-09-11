'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchHostels } from '@/lib/api'
import { AMENITY_OPTIONS, HOSTEL_TYPES, SORT_OPTIONS } from '@/lib/constants'
import { useWorldHostel } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Funnel, RotateCcw, SearchX, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { HostelCard } from './hostel-card'

function FiltersPanel() {
  const { filters, setFilter, toggleAmenity, resetFilters } = useWorldHostel()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4" aria-hidden /> Filters
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 gap-1 text-muted-foreground">
          <RotateCcw className="size-3.5" aria-hidden /> Clear all
        </Button>
      </div>

      {/* Vibe */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Vibe</legend>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={filters.type === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('type', '')}
            className="justify-start"
          >
            Any
          </Button>
          {HOSTEL_TYPES.map((t) => (
            <Button
              key={t.value}
              type="button"
              variant={filters.type === t.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('type', filters.type === t.value ? '' : t.value)}
              className="justify-start"
            >
              {t.label}
            </Button>
          ))}
        </div>
      </fieldset>

      <Separator />

      {/* Price */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Max price per night</legend>
        <div className="flex flex-wrap gap-2">
          {[null, 15, 20, 25, 30].map((v) => (
            <Button
              key={String(v)}
              type="button"
              variant={filters.maxPrice === v ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('maxPrice', v)}
            >
              {v === null ? 'Any' : `≤ $${v}`}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="number"
            min={5}
            max={100}
            aria-label="Custom maximum price in US dollars"
            placeholder="Custom $"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              setFilter('maxPrice', e.target.value === '' ? null : Math.max(1, Number(e.target.value)))
            }
            className="h-9"
          />
        </div>
      </fieldset>

      <Separator />

      {/* Rating */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Minimum rating</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { v: null, label: 'Any' },
            { v: 8, label: '8.0+' },
            { v: 8.5, label: '8.5+' },
            { v: 9, label: '9.0+' },
          ].map(({ v, label }) => (
            <Button
              key={label}
              type="button"
              variant={filters.minRating === v ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('minRating', v)}
            >
              {label}
            </Button>
          ))}
        </div>
      </fieldset>

      <Separator />

      {/* Amenities */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Amenities</legend>
        <div className="flex flex-col gap-2.5">
          {AMENITY_OPTIONS.map((amenity) => (
            <Label
              key={amenity}
              className="flex cursor-pointer items-center gap-2.5 text-sm font-normal"
            >
              <Checkbox
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
                aria-label={`Filter by ${amenity}`}
              />
              {amenity}
            </Label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

export function SearchView() {
  const { filters, openHostel, setFilter, resetFilters } = useWorldHostel()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['hostels', 'search', filters],
    queryFn: () => fetchHostels(filters),
    placeholderData: (prev) => prev,
  })

  const hostels = data?.hostels ?? []
  const total = data?.total ?? 0
  const hasActiveFilters =
    filters.q !== '' ||
    filters.city !== '' ||
    filters.type !== '' ||
    filters.minRating !== null ||
    filters.maxPrice !== null ||
    filters.amenities.length > 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {filters.city ? `Hostels in ${filters.city}` : filters.q ? `Results for “${filters.q}”` : 'All hostels'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {isLoading ? 'Searching hostels…' : `${total} ${total === 1 ? 'hostel' : 'hostels'} found`}
            {isFetching && !isLoading ? ' · updating…' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filters */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 lg:hidden">
                <Funnel className="size-4" aria-hidden /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-8">
                <FiltersPanel />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={filters.sort} onValueChange={(v) => setFilter('sort', v as typeof filters.sort)}>
            <SelectTrigger aria-label="Sort results" className="w-[190px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden lg:block">
          <Card className="sticky top-24">
            <CardContent className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
              <FiltersPanel />
            </CardContent>
          </Card>
        </aside>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-[4/3] rounded-2xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : hostels.length === 0 ? (
            <Card className={cn('flex min-h-[320px] items-center justify-center')}>
              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary">
                  <SearchX className="size-7 text-muted-foreground" aria-hidden />
                </span>
                <h3 className="text-lg font-semibold">No hostels matched</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Try a different destination or loosen your filters — the world is big
                  and beds are plenty.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={resetFilters} className="mt-1 gap-2">
                    <RotateCcw className="size-4" aria-hidden /> Clear all filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div
              className={cn(
                'grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3',
                isFetching && 'opacity-60'
              )}
            >
              {hostels.map((hostel) => (
                <HostelCard key={hostel.id} hostel={hostel} onSelect={openHostel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
