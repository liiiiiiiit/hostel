# Project Worklog — WorldHostel (Hostel Booking Website)

## Project Vision
A hostel booking platform (like Hostelworld / "worldhostel"): users search destinations,
browse hostels with filters, view hostel details (photos, rooms, reviews, amenities),
book rooms, and manage their bookings.

## Architecture Decisions
- Next.js 16 App Router, TypeScript, Tailwind 4, shadcn/ui (New York), lucide icons.
- ONLY the `/` route is user visible → all views (home / search / detail / bookings)
  are client-side states switched via a Zustand store (`src/lib/store.ts`).
- Backend via API routes (NO server actions):
  - `GET /api/hostels?q=&city=&minPrice=&maxPrice=&minRating=&amenities=&type=&sort=`
  - `GET /api/hostels/[id]` (includes rooms + reviews)
  - `POST /api/bookings` , `GET /api/bookings?email=` (bookings lookup by email)
- Prisma + SQLite (`db/custom.db`), schema in `prisma/schema.prisma`.
- Color scheme: warm terracotta/amber "sunset travel" palette (NO indigo/blue).
- Sticky footer with min-h-screen flex layout, safe-area aware.
- Images: real photos sourced via image-search skill (URLs listed below).

## Data Model (agreed contract between backend & frontend)
- Hostel: id, slug, name, city, country, description, longDescription, address,
  images (JSON string array), amenities (JSON string array), rating (1-10 float),
  reviewCount, priceFrom (int USD/night), type (backpacker|boutique|party|chill),
  vibe tags, lat/lng (optional), featured (bool), distanceToCenter (km float),
  createdAt.
- Room: id, hostelId, name, type (dorm|private|double|ensuite), capacity int,
  pricePerNight int, bedsTotal int, description, amenities JSON string.
- Review: id, hostelId, author, country, rating int (1-10), comment, createdAt.
- Booking: id, code, hostelId, roomId, guestName, guestEmail, checkIn (ISO date str),
  checkOut, guests int, nights int, totalPrice int, status (CONFIRMED), createdAt.

## API Response Shapes (contract)
- `GET /api/hostels` → `{ hostels: Hostel[], total: number }`
- `GET /api/hostels/[id]` → `{ hostel: Hostel & { rooms: Room[], reviews: Review[] } }`
- `POST /api/bookings` body `{ hostelId, roomId, guestName, guestEmail, checkIn, checkOut, guests }`
  → `{ booking }` (server computes nights & totalPrice, generates code like WH-XXXXXX)
- `GET /api/bookings?email=...` → `{ bookings: (Booking & {hostel, room})[] }`

## Seed Data
12 hostels across world cities (Lisbon, Barcelona, Bangkok, Bali, Amsterdam, Prague,
Tokyo, Sydney, Buenos Aires, Cape Town, Berlin, Istanbul), 3-4 rooms each,
3-4 reviews each. Image URLs from Task 2-a (see below).

## Sourced Image URLs
(placed in `scripts/images.json` by Task 2-a after image-search completes)

---
Task ID: 2-a
Agent: Z.ai orchestrator (image sourcing)
Task: Source real hostel/city images via image-search skill

Work Log:
- Ran 14 image-search queries (hostel interiors: dorm/common/private/rooftop/exterior/hero; 8 city views: lisbon, barcelona, bangkok, bali, amsterdam, prague, tokyo, sydney)
- Hit 429 rate limit with 5-way parallelism; succeeded with batches of 2 + retries
- Consolidated all URLs into /home/z/my-project/scripts/img/images.json (14 categories, 89 URLs, all verified HTTP 200)

Stage Summary:
- scripts/img/images.json is the single source of image URLs; seed script must read it
- Categories: dorm(9), common(8), private(8), rooftop(8), exterior(8), hero(6), lisbon(3), barcelona(3), bangkok(3), bali(3), amsterdam(3), prague(3), tokyo(3), sydney(3)

---
Task ID: 2-b
Agent: full-stack-developer (completed by orchestrator after subagent timeout)
Task: Backend — Prisma schema, seed data, API routes

Work Log:
- Subagent created prisma/schema.prisma (Hostel/Room/Review/Booking), scripts/seed.ts (877 lines, 12 hostels, rich per-city copy), src/app/api/_lib/serialize.ts, hostels routes, bookings routes; then timed out
- Orchestrator fixed two bugs:
  1. src/app/api/hostels/[id]/route.ts — wrong relative import (`../_lib/serialize` → `../../_lib/serialize`), which poisoned the whole API compile tree (all routes 500)
  2. src/app/api/hostels/route.ts — `Number(searchParams.get('maxPrice'))` bug: Number(null)===0, so absent maxPrice filtered ALL hostels via priceFrom<=0. Added numberParam() helper normalizing absent/invalid params to null
- Ran db:push + seed: 12 hostels, 48 rooms, 48 reviews. Cleaned test bookings
- Verified: list+filters+sort (city/type/price/rating/q/amenities), slug detail (rooms+reviews), POST booking (201, WH-code, nights, totalPrice), over-capacity 400, bad-email 400, GET bookings by email with relations

Stage Summary:
- All APIs verified working on port 3000. Data contract unchanged (see top of worklog)
- Frontend can rely on: GET /api/hostels, GET /api/hostels/[idOrSlug], POST /api/bookings, GET /api/bookings?email=

---
Task ID: 2-c
Agent: Z.ai orchestrator (frontend)
Task: Frontend — store, components, all views

Work Log:
- Created src/lib/types.ts, constants.ts (hero + 8 destinations), store.ts (Zustand: view/filters/guestSearch/bookingEmail), api.ts (fetchers for all 4 endpoints)
- Created src/components/providers.tsx (TanStack Query + sonner Toaster)
- Components: site-header (sticky), site-footer (sticky-footer layout, city links), search-bar (destination/dates/guests), hostel-card, rating-badge, home-view (hero/value props/featured/destinations/CTA), search-view (filter sidebar + mobile Sheet + sort + skeletons + empty state), detail-view (gallery/amenities/location/rooms/sticky booking panel), booking-dialog (summary → confirm → code), bookings-view (email lookup + booking cards)
- page.tsx composes 4 client-side views via Zustand; layout.tsx updated metadata + Providers; globals.css warm terracotta palette + custom scrollbars
- Fixed: missing Button import in home-view; removed unused eslint-disable directives → lint clean

Stage Summary:
- Single-page app on / with 4 views, fully responsive (desktop sidebar filters, mobile sheet filters), warm terracotta design, accessible (aria labels, roles, keyboard nav)

---
Task ID: 4
Agent: Z.ai orchestrator (verification)
Task: End-to-end browser verification & fixes

Work Log:
- Fixed subagent's API bugs: [id] route import path (../../_lib), Number(null)===0 filter bug in hostels list route
- Cleaned watermarked/HEIF images: audited all 71 sourced images; removed 4 watermarked dorms (Dreamstime/Alamy), 2 Alamy exteriors, 1 Tagvenue-watermarked rooftop, 1 HEIF (dorm-8); swapped hero to clean StockCake image; re-seeded
- Agent Browser verified: home hero/featured/destinations render with real API data; Bali chip → search (1 result); filters (clear-all, Party→3, footer city links); detail gallery/rooms/reviews; booking flow ×2 (form → validation → confirm dialog with WH-code); bookings lookup by email; mobile 390px (stacked cards, filter sheet, search flow); footer sticks to bottom on short pages; desktop 1440px hero
- Final: lint clean, dev.log 0 errors / no 500s

Stage Summary:
- All golden-path flows browser-verified end-to-end. Demo booking left in DB: leo@example.com (WH-UMMUSR) for lookup demo
