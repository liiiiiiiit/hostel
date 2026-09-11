'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchHostels } from '@/lib/api'
import { DESTINATIONS, HERO_IMAGE } from '@/lib/constants'
import { useWorldHostel } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgePercent,
  CircleCheck,
  Headphones,
  MapPin,
  Star,
} from 'lucide-react'
import { HostelCard } from './hostel-card'
import { SearchBar } from './search-bar'

const VALUE_PROPS = [
  {
    icon: BadgePercent,
    title: 'Best price guarantee',
    text: 'Find it cheaper elsewhere and we will refund the difference — double.',
  },
  {
    icon: CircleCheck,
    title: 'Free cancellation',
    text: 'Plans change. Most rooms can be cancelled for free up to 48h before arrival.',
  },
  {
    icon: Star,
    title: 'Verified reviews',
    text: 'Over 10 million honest reviews from travelers who actually stayed there.',
  },
  {
    icon: Headphones,
    title: '24/7 support',
    text: 'Real humans, in 19 languages, whenever your journey hits a snag.',
  },
]

export function HomeView() {
  const { openHostel, searchDestination, setFilter, navigate } = useWorldHostel()

  const { data, isLoading } = useQuery({
    queryKey: ['hostels', 'featured'],
    queryFn: () => fetchHostels({ sort: 'rating_desc' }),
  })

  const featured = (data?.hostels ?? []).filter((h) => h.featured).slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Backpacker watching the sunrise over the mountains"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center text-white"
          >
            <span className="mb-4 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur">
              23,000 hostels · 170 countries · 10M travelers
            </span>
            <h1 className="max-w-3xl text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              Sleep cheap. Travel far.
              <span className="block text-amber-300">Meet the world.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/85 sm:text-base">
              From Bali beach bunks to Tokyo capsule pods — find, compare and book the
              world&apos;s best hostels in seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 w-full max-w-4xl"
          >
            <SearchBar variant="hero" />
          </motion.div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80">
            <span className="mr-1">Popular right now:</span>
            {['Bali', 'Lisbon', 'Bangkok', 'Tokyo'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => searchDestination(city)}
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1 font-medium backdrop-blur transition hover:bg-white/25"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section aria-label="Why book with WorldHostel" className="border-b bg-secondary/50">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <prop.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{prop.title}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{prop.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured hostels */}
      <section aria-labelledby="featured-heading" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 id="featured-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured hostels
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hand-picked stays our traveler community loves right now
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('search')} className="gap-1 text-primary hover:text-primary">
            See all <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/3] rounded-2xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} onSelect={openHostel} />
            ))}
          </div>
        )}
      </section>

      {/* Destinations */}
      <section aria-labelledby="destinations-heading" className="bg-secondary/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6">
            <h2 id="destinations-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
              Popular destinations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump straight into the cities travelers can&apos;t stop talking about
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {DESTINATIONS.map((d) => (
              <button
                key={d.city}
                type="button"
                onClick={() => {
                  setFilter('city', d.city)
                  setFilter('q', '')
                  navigate('search')
                }}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none sm:aspect-[4/3]"
                aria-label={`Browse hostels in ${d.city}, ${d.country}`}
              >
                <img
                  src={d.image}
                  alt={`${d.city}, ${d.country}`}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute right-3 bottom-3 left-3 text-white">
                  <p className="flex items-center gap-1 text-base font-bold sm:text-lg">
                    <MapPin className="size-4 shrink-0" aria-hidden />
                    {d.city}
                  </p>
                  <p className="text-xs text-white/80">
                    {d.country} · {d.hostelCount}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-amber-600 px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your next roomie is already there
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-primary-foreground/85">
            Shared kitchens, rooftop dinners, walking tours with strangers who leave as
            friends. That&apos;s the hostel life — starting at $10 a night.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('search')}
            className="mt-6 gap-2 font-semibold text-foreground"
          >
            Browse all hostels <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </section>
    </div>
  )
}
