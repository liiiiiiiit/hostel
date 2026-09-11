import type {
  BookingWithRelations,
  Hostel,
  HostelDetail,
  SortKey,
} from './types'

export interface HostelsResponse {
  hostels: Hostel[]
  total: number
}

export interface BookingsResponse {
  bookings: BookingWithRelations[]
}

export function buildHostelQuery(
  filters: Partial<{
    q: string
    city: string
    type: string
    minRating: number | null
    maxPrice: number | null
    amenities: string[]
    sort: SortKey
  }>
): string {
  const params = new URLSearchParams()
  if (filters.q?.trim()) params.set('q', filters.q.trim())
  if (filters.city?.trim()) params.set('city', filters.city.trim())
  if (filters.type) params.set('type', filters.type)
  if (filters.minRating !== null && filters.minRating !== undefined)
    params.set('minRating', String(filters.minRating))
  if (filters.maxPrice !== null && filters.maxPrice !== undefined)
    params.set('maxPrice', String(filters.maxPrice))
  if (filters.amenities && filters.amenities.length > 0)
    params.set('amenities', filters.amenities.join(','))
  if (filters.sort) params.set('sort', filters.sort)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export async function fetchHostels(
  filters: Partial<{
    q: string
    city: string
    type: string
    minRating: number | null
    maxPrice: number | null
    amenities: string[]
    sort: SortKey
  }>
): Promise<HostelsResponse> {
  const res = await fetch(`/api/hostels${buildHostelQuery(filters)}`)
  if (!res.ok) throw new Error('Failed to load hostels')
  return res.json()
}

export async function fetchHostelDetail(slug: string): Promise<HostelDetail> {
  const res = await fetch(`/api/hostels/${encodeURIComponent(slug)}`)
  if (!res.ok) {
    if (res.status === 404) throw new Error('Hostel not found')
    throw new Error('Failed to load hostel')
  }
  const data: { hostel: HostelDetail } = await res.json()
  return data.hostel
}

export interface BookingInput {
  hostelId: string
  roomId: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  guests: number
}

export async function createBooking(input: BookingInput): Promise<{ booking: BookingWithRelations }> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Booking failed')
  return data
}

export async function fetchBookings(email: string): Promise<BookingsResponse> {
  const res = await fetch(
    `/api/bookings?email=${encodeURIComponent(email)}`
  )
  if (!res.ok) throw new Error('Failed to load bookings')
  return res.json()
}
