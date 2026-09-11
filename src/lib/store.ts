'use client'

import { create } from 'zustand'
import type { SortKey } from './types'

export type View = 'home' | 'search' | 'detail' | 'bookings'

export interface HostelFilters {
  q: string
  city: string
  type: string
  minRating: number | null
  maxPrice: number | null
  amenities: string[]
  sort: SortKey
}

export interface GuestSearch {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
}

export const DEFAULT_FILTERS: HostelFilters = {
  q: '',
  city: '',
  type: '',
  minRating: null,
  maxPrice: null,
  amenities: [],
  sort: 'recommended',
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function defaultGuestSearch(): GuestSearch {
  const checkIn = new Date()
  checkIn.setDate(checkIn.getDate() + 7)
  const checkOut = new Date(checkIn)
  checkOut.setDate(checkOut.getDate() + 3)
  return { destination: '', checkIn: isoDate(checkIn), checkOut: isoDate(checkOut), guests: 1 }
}

interface WorldHostelState {
  view: View
  selectedSlug: string | null
  filters: HostelFilters
  guestSearch: GuestSearch
  bookingEmail: string
  navigate: (view: View) => void
  openHostel: (slug: string) => void
  setFilter: <K extends keyof HostelFilters>(key: K, value: HostelFilters[K]) => void
  toggleAmenity: (amenity: string) => void
  resetFilters: () => void
  setGuestSearch: (patch: Partial<GuestSearch>) => void
  searchDestination: (destination: string) => void
  setBookingEmail: (email: string) => void
}

export const useWorldHostel = create<WorldHostelState>((set) => ({
  view: 'home',
  selectedSlug: null,
  filters: { ...DEFAULT_FILTERS },
  guestSearch: defaultGuestSearch(),
  bookingEmail: '',

  navigate: (view) => set({ view }),

  openHostel: (slug) => set({ selectedSlug: slug, view: 'detail' }),

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  toggleAmenity: (amenity) =>
    set((state) => {
      const has = state.filters.amenities.includes(amenity)
      return {
        filters: {
          ...state.filters,
          amenities: has
            ? state.filters.amenities.filter((a) => a !== amenity)
            : [...state.filters.amenities, amenity],
        },
      }
    }),

  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),

  setGuestSearch: (patch) =>
    set((state) => ({ guestSearch: { ...state.guestSearch, ...patch } })),

  searchDestination: (destination) =>
    set((state) => ({
      guestSearch: { ...state.guestSearch, destination },
      filters: { ...state.filters, q: destination.trim(), city: '' },
      view: 'search',
    })),

  setBookingEmail: (bookingEmail) => set({ bookingEmail }),
}))
