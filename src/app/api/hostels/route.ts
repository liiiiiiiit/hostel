/**
 * GET /api/hostels
 * Query params: q, city, type, minPrice, maxPrice, minRating, amenities (comma
 * separated, ALL must match), sort (recommended|price_asc|price_desc|rating_desc|distance_asc)
 * Returns: { hostels: ParsedHostel[], total: number }
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseHostel } from '../_lib/serialize'

export const dynamic = 'force-dynamic'

/**
 * Parse an optional numeric query param.
 * NOTE: `Number(null)` and `Number('')` are both 0 (not NaN), so absent params
 * must be normalized to null BEFORE the Number() call — otherwise a missing
 * `maxPrice` would filter every hostel out with `priceFrom <= 0`.
 */
function numberParam(value: string | null): number | null {
  if (value === null || value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const q = (searchParams.get('q') ?? '').trim()
  const city = (searchParams.get('city') ?? '').trim()
  const type = (searchParams.get('type') ?? '').trim()
  const amenitiesParam = (searchParams.get('amenities') ?? '').trim()
  const sort = (searchParams.get('sort') ?? 'recommended').trim()

  const minPrice = numberParam(searchParams.get('minPrice'))
  const maxPrice = numberParam(searchParams.get('maxPrice'))
  const minRating = numberParam(searchParams.get('minRating'))

  // SQLite has no reliable case-insensitive matching via Prisma `mode`,
  // and the dataset is small — fetch all rows and filter in memory.
  const rows = await db.hostel.findMany()

  let hostels = rows.map(parseHostel)

  if (q) {
    const needle = q.toLowerCase()
    hostels = hostels.filter(
      (h) =>
        h.name.toLowerCase().includes(needle) ||
        h.city.toLowerCase().includes(needle) ||
        h.country.toLowerCase().includes(needle)
    )
  }

  if (city) {
    const needle = city.toLowerCase()
    hostels = hostels.filter((h) => h.city.toLowerCase().includes(needle))
  }

  if (type) {
    const needle = type.toLowerCase()
    hostels = hostels.filter((h) => h.type.toLowerCase() === needle)
  }

  if (minPrice !== null) {
    hostels = hostels.filter((h) => h.priceFrom >= minPrice)
  }

  if (maxPrice !== null) {
    hostels = hostels.filter((h) => h.priceFrom <= maxPrice)
  }

  if (minRating !== null) {
    hostels = hostels.filter((h) => h.rating >= minRating)
  }

  if (amenitiesParam) {
    const required = amenitiesParam
      .split(',')
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean)
    if (required.length > 0) {
      hostels = hostels.filter((h) => {
        const owned = h.amenities.map((a) => a.toLowerCase())
        return required.every((r) => owned.includes(r))
      })
    }
  }

  switch (sort) {
    case 'price_asc':
      hostels.sort((a, b) => a.priceFrom - b.priceFrom)
      break
    case 'price_desc':
      hostels.sort((a, b) => b.priceFrom - a.priceFrom)
      break
    case 'rating_desc':
      hostels.sort((a, b) => b.rating - a.rating)
      break
    case 'distance_asc':
      hostels.sort((a, b) => a.distanceToCenter - b.distanceToCenter)
      break
    case 'recommended':
    default:
      hostels.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating
      )
      break
  }

  return NextResponse.json({ hostels, total: hostels.length })
}
