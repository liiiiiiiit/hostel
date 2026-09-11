/**
 * Shared helpers for WorldHostel API routes.
 * JSON string columns (images, amenities) are parsed into real arrays
 * before leaving the API, per the data contract in worklog.md.
 */
import type { Hostel, Room, Review, Booking } from '@prisma/client'

export type ParsedHostel = Omit<Hostel, 'images' | 'amenities'> & {
  images: string[]
  amenities: string[]
}

export type ParsedRoom = Omit<Room, 'amenities'> & {
  amenities: string[]
}

export type HostelDetail = ParsedHostel & {
  rooms: ParsedRoom[]
  reviews: Review[]
}

export type BookingWithRelations = Booking & {
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

function parseJsonArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

export function parseHostel(hostel: Hostel): ParsedHostel {
  return {
    ...hostel,
    images: parseJsonArray(hostel.images),
    amenities: parseJsonArray(hostel.amenities),
  }
}

export function parseRoom(room: Room): ParsedRoom {
  return {
    ...room,
    amenities: parseJsonArray(room.amenities),
  }
}

export function parseHostelDetail(
  hostel: Hostel & { rooms: Room[]; reviews: Review[] }
): HostelDetail {
  return {
    ...parseHostel(hostel),
    rooms: hostel.rooms.map(parseRoom),
    reviews: hostel.reviews,
  }
}

type BookingRow = Booking & {
  hostel: { name: string; city: string; country: string; images: string }
  room: { name: string; type: string }
}

export function parseBookingWithRelations(booking: BookingRow): BookingWithRelations {
  return {
    ...booking,
    hostel: {
      name: booking.hostel.name,
      city: booking.hostel.city,
      country: booking.hostel.country,
      images: parseJsonArray(booking.hostel.images),
    },
    room: {
      name: booking.room.name,
      type: booking.room.type,
    },
  }
}
