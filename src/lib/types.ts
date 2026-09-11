/** Shared API types for WorldHostel (matches worklog.md contract) */

export interface Hostel {
  id: string
  slug: string
  name: string
  city: string
  country: string
  description: string
  longDescription: string
  address: string
  images: string[]
  amenities: string[]
  rating: number
  reviewCount: number
  priceFrom: number
  type: 'backpacker' | 'boutique' | 'party' | 'chill' | string
  featured: boolean
  distanceToCenter: number
  freeCancellation: boolean
  breakfastIncluded: boolean
  createdAt: string
}

export interface Room {
  id: string
  hostelId: string
  name: string
  type: 'dorm' | 'private' | 'double' | 'ensuite' | string
  capacity: number
  pricePerNight: number
  bedsTotal: number
  description: string
  amenities: string[]
}

export interface Review {
  id: string
  hostelId: string
  author: string
  country: string
  rating: number
  comment: string
  createdAt: string
}

export interface HostelDetail extends Hostel {
  rooms: Room[]
  reviews: Review[]
}

export interface Booking {
  id: string
  code: string
  hostelId: string
  roomId: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  totalPrice: number
  status: string
  createdAt: string
}

export interface BookingWithRelations extends Booking {
  hostel: {
    name: string
    city: string
    country: string
    images: string[]
  }
  room: {
    name: string
    type: string
  }
}

export type SortKey =
  | 'recommended'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'distance_asc'
