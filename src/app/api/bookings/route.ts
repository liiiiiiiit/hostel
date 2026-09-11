/**
 * /api/bookings
 * POST — create a booking: { hostelId, roomId, guestName, guestEmail, checkIn, checkOut, guests }
 *   → 201 { booking }, validation errors → 400 { error }
 * GET  ?email=… → { bookings: BookingWithRelations[] } (hostel + room included, newest first)
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseBookingWithRelations } from '../_lib/serialize'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const DAY_MS = 24 * 60 * 60 * 1000
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function generateCode(): string {
  let code = 'WH-'
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest('Request body must be valid JSON')
  }

  if (typeof body !== 'object' || body === null) {
    return badRequest('Request body must be a JSON object')
  }

  const data = body as Record<string, unknown>
  const {
    hostelId,
    roomId,
    guestName,
    guestEmail,
    checkIn,
    checkOut,
  } = data
  const guests = Number(data.guests)

  // --- Presence & type validation ---
  const stringFields: [string, unknown][] = [
    ['hostelId', hostelId],
    ['roomId', roomId],
    ['guestName', guestName],
    ['guestEmail', guestEmail],
    ['checkIn', checkIn],
    ['checkOut', checkOut],
  ]
  for (const [field, value] of stringFields) {
    if (typeof value !== 'string' || value.trim() === '') {
      return badRequest(`${field} is required`)
    }
  }

  if (!EMAIL_RE.test(guestEmail as string)) {
    return badRequest('Invalid email address')
  }

  if (!Number.isInteger(guests) || guests < 1) {
    return badRequest('guests must be an integer of at least 1')
  }

  if (!DATE_RE.test(checkIn as string) || !DATE_RE.test(checkOut as string)) {
    return badRequest('checkIn and checkOut must be in YYYY-MM-DD format')
  }

  // --- Date validation ---
  const inDate = new Date(`${checkIn}T00:00:00.000Z`)
  const outDate = new Date(`${checkOut}T00:00:00.000Z`)
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
    return badRequest('checkIn and checkOut must be valid calendar dates')
  }

  const nights = Math.round((outDate.getTime() - inDate.getTime()) / DAY_MS)
  if (nights < 1) {
    return badRequest('checkOut must be at least one day after checkIn')
  }

  // --- Room & hostel validation ---
  const room = await db.room.findUnique({ where: { id: roomId as string } })
  if (!room) {
    return badRequest('Room not found')
  }
  if (room.hostelId !== hostelId) {
    return badRequest('Room does not belong to this hostel')
  }
  if (guests > room.capacity) {
    return badRequest(
      `This room fits at most ${room.capacity} guest${room.capacity > 1 ? 's' : ''} per booking`
    )
  }

  // --- Unique booking code (WH-XXXXXX) ---
  let code = generateCode()
  while (await db.booking.findUnique({ where: { code } })) {
    code = generateCode()
  }

  const booking = await db.booking.create({
    data: {
      code,
      hostelId: hostelId as string,
      roomId: room.id,
      guestName: (guestName as string).trim(),
      guestEmail: (guestEmail as string).trim().toLowerCase(),
      checkIn: checkIn as string,
      checkOut: checkOut as string,
      guests,
      nights,
      totalPrice: nights * room.pricePerNight,
      status: 'CONFIRMED',
    },
  })

  return NextResponse.json({ booking }, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = (searchParams.get('email') ?? '').trim().toLowerCase()

  if (!email) {
    return badRequest('email query parameter is required')
  }

  const bookings = await db.booking.findMany({
    where: { guestEmail: email },
    include: {
      hostel: { select: { name: true, city: true, country: true, images: true } },
      room: { select: { name: true, type: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ bookings: bookings.map(parseBookingWithRelations) })
}
