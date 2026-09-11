/**
 * GET /api/hostels/[id]
 * Looks up a hostel by id first, then by slug. Includes rooms (price asc)
 * and reviews (newest first). Returns: { hostel: HostelDetail }
 * 404 → { error: "Hostel not found" }
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseHostelDetail } from '../../_lib/serialize'

export const dynamic = 'force-dynamic'

const include = {
  rooms: { orderBy: { pricePerNight: 'asc' as const } },
  reviews: { orderBy: { createdAt: 'desc' as const } },
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  let hostel = await db.hostel.findUnique({ where: { id }, include })
  if (!hostel) {
    hostel = await db.hostel.findFirst({ where: { slug: id }, include })
  }

  if (!hostel) {
    return NextResponse.json({ error: 'Hostel not found' }, { status: 404 })
  }

  return NextResponse.json({ hostel: parseHostelDetail(hostel) })
}
