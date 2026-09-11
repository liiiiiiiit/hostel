/**
 * WorldHostel — seed script
 * Run with: bun scripts/seed.ts
 *
 * Seeds 12 hostels (one per city), 4 rooms + 4 reviews each.
 * Image URLs are read from scripts/img/images.json (produced by Task 2-a).
 */

import { PrismaClient } from '@prisma/client'
import { join } from 'path'

const db = new PrismaClient()

type ImageCategories = Record<string, string[]>

interface HostelSeed {
  name: string
  slug: string
  city: string
  country: string
  type: 'backpacker' | 'boutique' | 'party' | 'chill'
  priceFrom: number
  rating: number
  featured: boolean
  distanceToCenter: number
  freeCancellation: boolean
  breakfastIncluded: boolean
  reviewCount: number
  description: string
  longDescription: string
  address: string
  amenities: string[]
  cityImageKey: string | null // images.json category for the cover image, or null → exterior
  reviewRatings: number[]
  reviews: { author: string; country: string; comment: string }[]
}

const hostels: HostelSeed[] = [
  {
    name: 'Sunset Vista Hostel',
    slug: 'sunset-vista-hostel',
    city: 'Lisbon',
    country: 'Portugal',
    type: 'backpacker',
    priceFrom: 18,
    rating: 9.2,
    featured: true,
    distanceToCenter: 0.6,
    freeCancellation: true,
    breakfastIncluded: false,
    reviewCount: 342,
    description:
      'Sunset sessions on our Alfama rooftop, steps from miradouros, tiled lanes and the rattling Tram 28.',
    longDescription:
      "Perched in the heart of Alfama, Sunset Vista Hostel looks straight over the tiled rooftops of Lisbon's oldest quarter. We run a free caipirinha hour on the rooftop every evening as the sun drops behind the Tagus, and our kitchen crew cooks a family-style dinner three nights a week. Tram 28 stops at the door, putting the castle, Baixa and Bairro Alto within an easy ride.",
    address: 'Rua das Escolas Gerais 42, Alfama, 1100-218 Lisbon',
    amenities: [
      'Free WiFi',
      'Shared Kitchen',
      'Rooftop Terrace',
      'Luggage Storage',
      '24/7 Reception',
      'City Tours',
      'Laundry',
      'Lockers',
      'Bar',
    ],
    cityImageKey: 'lisbon',
    reviewRatings: [10, 9, 10, 9],
    reviews: [
      {
        author: 'Marta Oliveira',
        country: 'Portugal',
        comment:
          'The rooftop sunset sessions are exactly as promised — staff even handed out blankets when it got chilly. Best location in Alfama, and the family dinners are a lovely touch.',
      },
      {
        author: 'Ben Whitaker',
        country: 'Australia',
        comment:
          'Beds are comfy with proper privacy curtains and the lockers fit a full backpack. Tram 28 at the doorstep is loud by day but earplugs are provided.',
      },
      {
        author: 'Sofia Marchetti',
        country: 'Italy',
        comment:
          'Spotless showers, the free walking tour was brilliant, and I extended my stay twice. The view from the terrace alone is worth the price.',
      },
      {
        author: 'Daan Vermeulen',
        country: 'Netherlands',
        comment:
          'Great social vibe without being a party hostel. Kitchen is well stocked and reception sorted our Sintra train tickets in minutes.',
      },
    ],
  },
  {
    name: 'Gaudi Vibes Hostel',
    slug: 'gaudi-vibes-hostel',
    city: 'Barcelona',
    country: 'Spain',
    type: 'boutique',
    priceFrom: 24,
    rating: 9.0,
    featured: true,
    distanceToCenter: 0.8,
    freeCancellation: true,
    breakfastIncluded: true,
    reviewCount: 418,
    description:
      "Design-led bunks in a modernista townhouse, eight minutes' walk from the Sagrada Família.",
    longDescription:
      'Gaudi Vibes occupies a restored 1904 modernista townhouse in Eixample — mosaic floors, high ceilings and a leafy interior courtyard where breakfast is baked fresh every morning. Every bunk comes with a privacy curtain, reading light and full-size locker. We are a ten-minute stroll from the Sagrada Família with the Gaudí metro stop practically on the corner.',
    address: 'Carrer de Mallorca 291, Eixample, 08037 Barcelona',
    amenities: [
      'Free WiFi',
      'Breakfast',
      'Cafe',
      'Air Conditioning',
      'Lockers',
      'Luggage Storage',
      '24/7 Reception',
      'Shared Kitchen',
      'Bicycle Rental',
    ],
    cityImageKey: 'barcelona',
    reviewRatings: [9, 9, 9, 9],
    reviews: [
      {
        author: 'Claire Dubois',
        country: 'France',
        comment:
          "The most beautiful hostel I've stayed in — mosaic floors, fresh pastries for breakfast and a quiet courtyard for morning coffee.",
      },
      {
        author: "Liam O'Connor",
        country: 'Ireland',
        comment:
          'Walked to the Sagrada Família in eight minutes. Bunks feel premium with blackout curtains and big lockers.',
      },
      {
        author: 'Ana Torres',
        country: 'Mexico',
        comment:
          'Bathrooms were cleaned constantly and the staff gave us a handwritten tapas map. Air con worked perfectly even in August.',
      },
      {
        author: 'Jonas Weber',
        country: 'Germany',
        comment:
          'Quiet for Barcelona, which I loved. Only note: the heritage staircase is a workout with luggage, but that is part of the charm.',
      },
    ],
  },
  {
    name: 'Chao Phraya Backpackers',
    slug: 'chao-phraya-backpackers',
    city: 'Bangkok',
    country: 'Thailand',
    type: 'party',
    priceFrom: 10,
    rating: 8.6,
    featured: true,
    distanceToCenter: 1.9,
    freeCancellation: false,
    breakfastIncluded: false,
    reviewCount: 476,
    description:
      'Riverside party hostel with a canal-side bar, free shots at check-in and nightly tuk-tuk pub crawls.',
    longDescription:
      'Chao Phraya Backpackers sits on a quiet klong a short walk from Khao San Road — close enough for the chaos, far enough to sleep. Our canal-side bar runs two-for-one buckets until late, and the nightly tuk-tuk pub crawl leaves reception at 21:00 sharp. Cool off in the courtyard pool between temple-hopping trips to the Grand Palace and Wat Arun.',
    address: '42 Samsen Road, Banglumphu, 10200 Bangkok',
    amenities: [
      'Free WiFi',
      'Bar',
      'Outdoor Pool',
      '24/7 Reception',
      'Airport Shuttle',
      'City Tours',
      'Laundry',
      'Luggage Storage',
    ],
    cityImageKey: 'bangkok',
    reviewRatings: [9, 8, 8, 9],
    reviews: [
      {
        author: 'Tomás Silva',
        country: 'Brazil',
        comment:
          'The canal-side bar is dangerously fun and the pub crawl was the best night of my trip. The pool is a lifesaver in the Bangkok heat.',
      },
      {
        author: 'Hannah Kim',
        country: 'South Korea',
        comment:
          'Location is a short walk from Khao San but quiet enough to sleep. Staff booked our overnight train to Chiang Mai with no problem.',
      },
      {
        author: 'Jake Morrison',
        country: 'Canada',
        comment:
          'Great party crowd without being overwhelming. Showers could be stronger but the free shots at check-in make up for it.',
      },
      {
        author: 'Priya Nair',
        country: 'India',
        comment:
          'Airport shuttle was waiting despite our 2am landing. Dorms have good lockers and the AC rooms are worth the extra baht.',
      },
    ],
  },
  {
    name: 'Island Breeze Hostel',
    slug: 'island-breeze-hostel',
    city: 'Canggu, Bali',
    country: 'Indonesia',
    type: 'chill',
    priceFrom: 14,
    rating: 9.4,
    featured: true,
    distanceToCenter: 2.8,
    freeCancellation: true,
    breakfastIncluded: true,
    reviewCount: 289,
    description:
      "Bali's slow-living hostel: poolside hammocks, surfboard racks and smoothie bowls all day.",
    longDescription:
      'Island Breeze is a bamboo-and-teak hideaway among the rice paddies of Canggu, five minutes by scooter from Batu Bolong beach. Mornings start with free yoga on the deck and cold brew from the garden cafe, and the outdoor pool is fringed with hammocks for proper do-nothing afternoons. Surfboards, scooters and sunset drivers can all be booked at reception.',
    address: 'Jalan Pantai Batu Bolong 27, Canggu, 80361 Bali',
    amenities: [
      'Free WiFi',
      'Breakfast',
      'Outdoor Pool',
      'Cafe',
      'Shared Kitchen',
      'Laundry',
      'Bicycle Rental',
      'Air Conditioning',
      'Luggage Storage',
    ],
    cityImageKey: 'bali',
    reviewRatings: [10, 9, 10, 9],
    reviews: [
      {
        author: 'Emma Lindqvist',
        country: 'Sweden',
        comment:
          'Pure calm — yoga on the deck at 8am, smoothie bowls, hammocks by the pool. I came for three nights and stayed ten.',
      },
      {
        author: 'Diego Fuentes',
        country: 'Chile',
        comment:
          'Best hostel in Canggu for actually relaxing. Surfboard racks kept our boards safe and reception arranged lessons at Batu Bolong.',
      },
      {
        author: 'Yuki Tanaka',
        country: 'Japan',
        comment:
          'The bamboo architecture is stunning and everything is spotless. Cold brew from the garden cafe every morning was a ritual.',
      },
      {
        author: 'Ava Thompson',
        country: 'United Kingdom',
        comment:
          'Scooter rental through the hostel was cheap and painless. The pool area gets busy at sunset but that is part of the charm.',
      },
    ],
  },
  {
    name: 'Canal House Lodge',
    slug: 'canal-house-lodge',
    city: 'Amsterdam',
    country: 'Netherlands',
    type: 'boutique',
    priceFrom: 30,
    rating: 8.8,
    featured: true,
    distanceToCenter: 1.2,
    freeCancellation: true,
    breakfastIncluded: true,
    reviewCount: 203,
    description:
      "Boutique bunks in a 17th-century canal house on the Jordaan's prettiest street.",
    longDescription:
      "Canal House Lodge fills a listed 1675 merchant's house on the Bloemgracht, with original beams, a spiral staircase and bunk views straight over the water. Rooms are compact but beautifully made — Dutch-design bunks, blackout curtains and underfloor heating in the bathrooms. The Anne Frank House, the Nine Streets and the Jordaan's brown cafes are all within a five-minute wander.",
    address: 'Bloemgracht 87, Jordaan, 1016 KC Amsterdam',
    amenities: [
      'Free WiFi',
      'Breakfast',
      'Cafe',
      'Lockers',
      '24/7 Reception',
      'Luggage Storage',
      'Bicycle Rental',
      'City Tours',
      'Shared Kitchen',
    ],
    cityImageKey: 'amsterdam',
    reviewRatings: [9, 8, 9, 8],
    reviews: [
      {
        author: 'Isabelle Vos',
        country: 'Netherlands',
        comment:
          'Sleeping in a 350-year-old canal house with this level of finish is special. Our bunks looked right over the Bloemgracht.',
      },
      {
        author: 'Marco Bianchi',
        country: 'Italy',
        comment:
          'Rooms are compact, as expected in Amsterdam, but beautifully designed and spotless. The breakfast spread with fresh bread and cheese was great.',
      },
      {
        author: 'Grace Sullivan',
        country: 'United States',
        comment:
          'Underfloor heated bathrooms are a game changer in February. The Anne Frank House is genuinely a five-minute walk away.',
      },
      {
        author: 'Andrés Rojas',
        country: 'Colombia',
        comment:
          'Staff helped us book museum tickets and marked up a cycling route. The stairs are steep — classic Amsterdam — so pack light if you can.',
      },
    ],
  },
  {
    name: 'Golden Gate Prague',
    slug: 'golden-gate-prague',
    city: 'Prague',
    country: 'Czech Republic',
    type: 'backpacker',
    priceFrom: 16,
    rating: 9.1,
    featured: true,
    distanceToCenter: 0.5,
    freeCancellation: true,
    breakfastIncluded: false,
    reviewCount: 355,
    description:
      'Social backpacker base under the castle with a beer-garden courtyard and free walking tours.',
    longDescription:
      'Golden Gate Prague hides behind an unmarked door in Malá Strana, a five-minute walk up to Prague Castle and down to Charles Bridge. Our cellar bar pours pilsner at student prices, the courtyard beer garden hosts weekly barbecues, and free walking tours leave every morning at ten. The staff will map out the viewpoints, jazz cellars and riverside spots worth your evening.',
    address: 'Újezd 19, Malá Strana, 118 01 Prague',
    amenities: [
      'Free WiFi',
      'Bar',
      'Shared Kitchen',
      'Pool Table',
      'Luggage Storage',
      '24/7 Reception',
      'City Tours',
      'Laundry',
      'Lockers',
    ],
    cityImageKey: 'prague',
    reviewRatings: [9, 9, 9, 9],
    reviews: [
      {
        author: 'Petra Novak',
        country: 'Czech Republic',
        comment:
          'As a local I send visiting friends here — unbeatable location under the castle and the cellar bar is properly priced.',
      },
      {
        author: 'Oliver Hughes',
        country: 'United Kingdom',
        comment:
          'The free walking tour from the door at 10am was excellent, and the beer-garden barbecue is a great way to meet people.',
      },
      {
        author: 'Elena Petrova',
        country: 'Bulgaria',
        comment:
          'Clean, safe, and the staff map of viewpoints saved us from the astronomical-clock crowds. Charles Bridge at dawn is five minutes away.',
      },
      {
        author: 'Samuel Adeyemi',
        country: 'Nigeria',
        comment:
          'Loved the social dinners in the courtyard. Lockers are big, beds are solid, and reception is open whenever you stumble home.',
      },
    ],
  },
  {
    name: 'Shibuya Sky Pod Hostel',
    slug: 'shibuya-sky-pod-hostel',
    city: 'Tokyo',
    country: 'Japan',
    type: 'chill',
    priceFrom: 22,
    rating: 9.3,
    featured: true,
    distanceToCenter: 0.7,
    freeCancellation: true,
    breakfastIncluded: true,
    reviewCount: 264,
    description:
      'Serene capsule-style pods above Shibuya crossing, with an onsen-inspired bath floor.',
    longDescription:
      "Shibuya Sky Pod is a calm eleventh-floor escape two minutes from Shibuya Station's Hachikō exit. Each pod has blackout curtains, a memory-foam mattress and its own reading light, while the shared bath floor replicates a neighbourhood sento with a cedar soaking tub. Tea is brewed all day in the manga lounge, and the concierge writes you a personal ramen map on arrival.",
    address: '2-11-3 Dogenzaka, Shibuya-ku, 150-0043 Tokyo',
    amenities: [
      'Free WiFi',
      'Breakfast',
      'Air Conditioning',
      'Lockers',
      'Luggage Storage',
      '24/7 Reception',
      'Laundry',
      'Cafe',
    ],
    cityImageKey: 'tokyo',
    reviewRatings: [10, 9, 9, 10],
    reviews: [
      {
        author: 'Ryo Nakamura',
        country: 'Japan',
        comment:
          'The cedar soaking tub on the bath floor is the perfect end to a day of walking Tokyo. My pod was immaculate with true blackout curtains.',
      },
      {
        author: 'Chloé Martin',
        country: 'France',
        comment:
          'Two minutes from Shibuya crossing yet eerily quiet up on the eleventh floor. The handwritten ramen map is a real document, and every stop was excellent.',
      },
      {
        author: 'Daniel Kim',
        country: 'Canada',
        comment:
          'Memory-foam pods are better than most real beds I have slept in. The tea lounge with manga was a great way to wind down.',
      },
      {
        author: 'Lucía Herrera',
        country: 'Spain',
        comment:
          'The concierge sorted our JR passes and a 6am wake-up for the fish market. Calm, kind, spotless — everything you want after a long flight.',
      },
    ],
  },
  {
    name: 'Harbour Backpackers',
    slug: 'harbour-backpackers',
    city: 'Sydney',
    country: 'Australia',
    type: 'party',
    priceFrom: 26,
    rating: 8.5,
    featured: true,
    distanceToCenter: 1.5,
    freeCancellation: true,
    breakfastIncluded: false,
    reviewCount: 431,
    description:
      'Harbour-side party hostel in The Rocks with a rooftop BBQ deck facing the Opera House.',
    longDescription:
      'Harbour Backpackers occupies a heritage sandstone warehouse in The Rocks, with a rooftop deck that stares straight at the Sydney Opera House and Harbour Bridge. Rooftop barbecues run every Friday, the basement bar hosts live bands on weekends, and the free breakfast keeps hangovers civil. Ferries, trains and the CBD nightclubs are all within ten minutes on foot.',
    address: '112 George Street, The Rocks, NSW 2000 Sydney',
    amenities: [
      'Free WiFi',
      'Bar',
      'Shared Kitchen',
      'Luggage Storage',
      '24/7 Reception',
      'City Tours',
      'Laundry',
      'Air Conditioning',
      'Airport Shuttle',
    ],
    cityImageKey: 'sydney',
    reviewRatings: [8, 9, 8, 8],
    reviews: [
      {
        author: 'Jack Fletcher',
        country: 'Australia',
        comment:
          'Rooftop views of the Opera House with your morning coffee is unreal. The Friday barbecues get rowdy in the best way.',
      },
      {
        author: 'Mia Andersen',
        country: 'Denmark',
        comment:
          'Live bands in the basement bar on Saturday — earplugs provided, and honestly you will want to be downstairs anyway.',
      },
      {
        author: 'Ravi Patel',
        country: 'United Kingdom',
        comment:
          'Location in The Rocks is perfect for ferries and trains. Kitchens get busy at dinner but there is plenty of fridge space.',
      },
      {
        author: 'Camila Ribeiro',
        country: 'Portugal',
        comment:
          'The free breakfast kept our budget alive and the Bondi walking tours were well run. Showers had good pressure, always a win.',
      },
    ],
  },
  {
    name: 'Palermo Soho House',
    slug: 'palermo-soho-house',
    city: 'Buenos Aires',
    country: 'Argentina',
    type: 'boutique',
    priceFrom: 15,
    rating: 8.9,
    featured: false,
    distanceToCenter: 2.2,
    freeCancellation: true,
    breakfastIncluded: false,
    reviewCount: 158,
    description:
      "Converted mansion with a lemon-tree patio in Palermo Soho, the city's café-and-cobble heart.",
    longDescription:
      'Palermo Soho House is a converted 1920s mansion on a cobbled block of Palermo Soho, wrapped around a lemon-tree patio that hosts a midweek asado. Interiors mix Argentine art, vintage furniture and a vinyl library you are welcome to raid. Boutique shopping, the Sunday flea market and the Subte at Plaza Italia are all moments away.',
    address: 'Gurruchaga 1614, Palermo Soho, C1412 Buenos Aires',
    amenities: [
      'Free WiFi',
      'Shared Kitchen',
      'Laundry',
      'Luggage Storage',
      '24/7 Reception',
      'City Tours',
      'Cafe',
      'Bar',
    ],
    cityImageKey: null,
    reviewRatings: [9, 9, 9, 9],
    reviews: [
      {
        author: 'Valentina Cruz',
        country: 'Argentina',
        comment:
          'The lemon-tree patio asado on Wednesdays is where everyone becomes friends. Gorgeous building with so much character.',
      },
      {
        author: 'Noah Berger',
        country: 'Switzerland',
        comment:
          'The vinyl library was a highlight — I spent an evening playing old tango records with people I had met at breakfast.',
      },
      {
        author: 'Inés García',
        country: 'Spain',
        comment:
          'Perfect Palermo Soho location among the boutiques and cafes, two blocks from Plaza Italia. Staff were lovely about our late checkout.',
      },
      {
        author: 'Peter Vandenberg',
        country: 'Belgium',
        comment:
          'Patio rooms get a little lively on asado nights, but the atmosphere more than makes up for it. Great value for this neighbourhood.',
      },
    ],
  },
  {
    name: "Lion's Head Lodge",
    slug: 'lions-head-lodge',
    city: 'Cape Town',
    country: 'South Africa',
    type: 'backpacker',
    priceFrom: 13,
    rating: 9.0,
    featured: false,
    distanceToCenter: 1.8,
    freeCancellation: true,
    breakfastIncluded: false,
    reviewCount: 176,
    description:
      'Sunny lodge between Table Mountain and the Sea Point promenade, with a braai deck and pool.',
    longDescription:
      "Lion's Head Lodge sits on the quiet slope between Table Mountain and the Sea Point promenade, with the trailhead for Lion's Head sunrise hikes a ten-minute walk away. The garden pool and braai deck catch the afternoon sun, and the shuttle to Camps Bay and the V&A Waterfront leaves three times a day. Our team arranges everything from shark diving to township jazz tours.",
    address: '22 Kloof Road, Green Point, 8005 Cape Town',
    amenities: [
      'Free WiFi',
      'Outdoor Pool',
      'Shared Kitchen',
      'Airport Shuttle',
      'City Tours',
      'Laundry',
      'Luggage Storage',
      '24/7 Reception',
    ],
    cityImageKey: null,
    reviewRatings: [9, 9, 9, 9],
    reviews: [
      {
        author: 'Sarah Mitchell',
        country: 'New Zealand',
        comment:
          "Staff woke us for the Lion's Head sunrise hike with coffee already ready — unforgettable. The garden pool and braai deck are lovely in the evening.",
      },
      {
        author: 'Lukas Meier',
        country: 'Switzerland',
        comment:
          'The shuttle to Camps Bay three times a day makes beach days effortless. Dorms are sunny and the whole place feels secure.',
      },
      {
        author: 'Thandiwe Dlamini',
        country: 'South Africa',
        comment:
          'The township jazz tour they arranged was the highlight of my month. Reception is a genuine travel desk, not just beds.',
      },
      {
        author: 'Oliver Grant',
        country: 'Ireland',
        comment:
          'Between Table Mountain and the promenade — you can hike or swim before breakfast. Clean kitchen and strong wifi throughout.',
      },
    ],
  },
  {
    name: 'East Side Berlin',
    slug: 'east-side-berlin',
    city: 'Berlin',
    country: 'Germany',
    type: 'party',
    priceFrom: 19,
    rating: 8.7,
    featured: false,
    distanceToCenter: 1.1,
    freeCancellation: false,
    breakfastIncluded: false,
    reviewCount: 341,
    description:
      'Friedrichshain institution beside the East Side Gallery — techno-friendly, sleep optional.',
    longDescription:
      'East Side Berlin is a former furniture factory on the Spree, painted floor to ceiling with murals and flanked by the East Side Gallery. Our own club nights warm up in the yard bar before rolling into Friedrichshain’s legendary techno clubs, many of which put us on the guest list. Late checkout at 14:00 exists for exactly one reason.',
    address: 'Revaler Straße 99, Friedrichshain, 10245 Berlin',
    amenities: [
      'Free WiFi',
      'Bar',
      'Pool Table',
      '24/7 Reception',
      'Luggage Storage',
      'City Tours',
      'Bicycle Rental',
      'Laundry',
    ],
    cityImageKey: null,
    reviewRatings: [9, 8, 8, 8],
    reviews: [
      {
        author: 'Lena Fischer',
        country: 'Germany',
        comment:
          'It is loud, it is murals, it is Berlin. The yard-bar warm-up then guest-list techno made a perfect Saturday. Late checkout exists for a reason.',
      },
      {
        author: "Kevin O'Brien",
        country: 'Ireland',
        comment:
          "Right on the East Side Gallery — you step out the door into Berlin history. Don't expect silence before 2am; do expect a great time.",
      },
      {
        author: 'Amélie Rousseau',
        country: 'France',
        comment:
          'A factory conversion with character everywhere. Staff got us into a club I had been refused at alone, which says it all.',
      },
      {
        author: 'Diego Álvarez',
        country: 'Argentina',
        comment:
          'Earplugs are provided and the party crowd is friendly rather than messy. Bike rental made Kreuzberg easy to explore.',
      },
    ],
  },
  {
    name: 'Bosphorus Bunk',
    slug: 'bosphorus-bunk',
    city: 'Istanbul',
    country: 'Turkey',
    type: 'backpacker',
    priceFrom: 12,
    rating: 8.4,
    featured: false,
    distanceToCenter: 0.9,
    freeCancellation: true,
    breakfastIncluded: false,
    reviewCount: 92,
    description:
      'Ottoman-townhouse bunks in Sultanahmet, minutes from the Blue Mosque and Hagia Sophia.',
    longDescription:
      'Bosphorus Bunk occupies a wooden Ottoman townhouse on a lantern-lit lane in Sultanahmet, between the Blue Mosque and Hagia Sophia. The rooftop terrace serves çay at sunset with ferry horns and seagulls for company, and the basement hammam-style showers are the best-kept secret in the old city. Trams, ferries and the Grand Bazaar are only minutes from the door.',
    address: 'Amiral Tafdil Sokak 14, Sultanahmet, 34122 Istanbul',
    amenities: [
      'Free WiFi',
      'Shared Kitchen',
      'Rooftop Terrace',
      'Luggage Storage',
      '24/7 Reception',
      'Airport Shuttle',
      'Laundry',
      'City Tours',
    ],
    cityImageKey: null,
    reviewRatings: [8, 8, 9, 8],
    reviews: [
      {
        author: 'Emre Yilmaz',
        country: 'Turkey',
        comment:
          'You are living inside a postcard — lantern-lit lane, wooden house, rooftop çay at sunset. The hammam-style showers are excellent.',
      },
      {
        author: 'Charlotte Evans',
        country: 'United Kingdom',
        comment:
          'The Blue Mosque and Hagia Sophia are within five minutes on foot. Rooms are snug, but the location is unbeatable at this price.',
      },
      {
        author: 'Aisha Rahman',
        country: 'Malaysia',
        comment:
          'Staff walked us to the ferry terminal personally and recommended a superb kebab place two lanes over. Very warm hospitality.',
      },
      {
        author: 'Stefan Kovač',
        country: 'Croatia',
        comment:
          'The Grand Bazaar is minutes away and the tram stop is right there. Wooden floors creak a bit, which adds charm more than noise.',
      },
    ],
  },
]

// Fixed room templates — prices are derived from each hostel's priceFrom.
const roomTemplates = (priceFrom: number) => [
  {
    name: '4-Bed Mixed Dorm',
    type: 'dorm',
    capacity: 1,
    pricePerNight: priceFrom + 6,
    bedsTotal: 12,
    description:
      'Our most social small dorm with sturdy bunks, deep mattresses and blackout curtains for lie-ins.',
    amenities: ['Reading light', 'Privacy curtain', 'Power outlet', 'Lockable wardrobe', 'Blackout curtains'],
  },
  {
    name: '8-Bed Social Dorm',
    type: 'dorm',
    capacity: 1,
    pricePerNight: priceFrom,
    bedsTotal: 16,
    description:
      'The budget pick where most friendships start — big lockers, privacy curtains and a lively but respectful crew.',
    amenities: ['Reading light', 'Privacy curtain', 'Power outlet', 'Lockable wardrobe'],
  },
  {
    name: 'Standard Private Room',
    type: 'private',
    capacity: 2,
    pricePerNight: priceFrom + 26,
    bedsTotal: 5,
    description:
      'A quiet double for two with city views and the corridor bathrooms just steps along the hall.',
    amenities: ['Towels included', 'City view', 'Blackout curtains', 'Power outlet'],
  },
  {
    name: 'Deluxe Double Ensuite',
    type: 'ensuite',
    capacity: 2,
    pricePerNight: priceFrom + 44,
    bedsTotal: 3,
    description:
      'Hotel-style comfort with your own ensuite bathroom, blackout curtains and the best view in the house.',
    amenities: ['Ensuite bathroom', 'Towels included', 'City view', 'Blackout curtains'],
  },
]

async function main() {
  // Load image URLs from the Task 2-a manifest.
  const imagesPath = join(import.meta.dir, 'img', 'images.json')
  const images = JSON.parse(await Bun.file(imagesPath).text()) as ImageCategories

  const cat = (key: string, i: number): string => {
    const arr = images[key]
    if (!arr || arr.length === 0) throw new Error(`Missing image category: ${key}`)
    return arr[i % arr.length]
  }

  // 1. Wipe existing data (respect FK order).
  await db.booking.deleteMany()
  await db.review.deleteMany()
  await db.room.deleteMany()
  await db.hostel.deleteMany()

  // 2. Seed hostels, rooms and reviews.
  for (let i = 0; i < hostels.length; i++) {
    const h = hostels[i]

    // Images: [city-or-exterior cover, dorm[i], common[i], rooftop[i], private[i], exterior[(i+3)%8]]
    const cover = h.cityImageKey ? cat(h.cityImageKey, 0) : cat('exterior', i)
    const hostelImages = [
      cover,
      cat('dorm', i),
      cat('common', i),
      cat('rooftop', i),
      cat('private', i),
      cat('exterior', i + 3),
    ]

    // Reviews spread over the last ~8 months (max ~200 days back).
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    const daysAgo = [12, 48, 96, 155].map((d) => d + i * 4)

    const reviewData = h.reviews.map((r, j) => ({
      author: r.author,
      country: r.country,
      rating: h.reviewRatings[j],
      comment: r.comment,
      createdAt: new Date(now - daysAgo[j] * day),
    }))

    await db.hostel.create({
      data: {
        slug: h.slug,
        name: h.name,
        city: h.city,
        country: h.country,
        description: h.description,
        longDescription: h.longDescription,
        address: h.address,
        images: JSON.stringify(hostelImages),
        amenities: JSON.stringify(h.amenities),
        rating: h.rating,
        reviewCount: h.reviewCount,
        priceFrom: h.priceFrom,
        type: h.type,
        featured: h.featured,
        distanceToCenter: h.distanceToCenter,
        freeCancellation: h.freeCancellation,
        breakfastIncluded: h.breakfastIncluded,
        rooms: {
          create: roomTemplates(h.priceFrom).map((r) => ({
            name: r.name,
            type: r.type,
            capacity: r.capacity,
            pricePerNight: r.pricePerNight,
            bedsTotal: r.bedsTotal,
            description: r.description,
            amenities: JSON.stringify(r.amenities),
          })),
        },
        reviews: { create: reviewData },
      },
    })

    console.log(`  ✓ ${h.name} (${h.city}) — ${hostelImages.length} images, 4 rooms, 4 reviews`)
  }

  // 3. Print counts.
  const [hostelCount, roomCount, reviewCount, bookingCount] = await Promise.all([
    db.hostel.count(),
    db.room.count(),
    db.review.count(),
    db.booking.count(),
  ])

  console.log('\nSeed complete:')
  console.log(`  Hostels: ${hostelCount}`)
  console.log(`  Rooms:   ${roomCount}`)
  console.log(`  Reviews: ${reviewCount}`)
  console.log(`  Bookings: ${bookingCount}`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
