import type { SortKey } from './types'

/** Hero + destination imagery (sourced via image-search, see scripts/img/images.json) */
export const HERO_IMAGE =
  'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f583c48575c7.jpg'

export interface Destination {
  city: string
  country: string
  image: string
  hostelCount: string
}

export const DESTINATIONS: Destination[] = [
  {
    city: 'Lisbon',
    country: 'Portugal',
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f2f7ce16abcb.jpg',
    hostelCount: '480 hostels',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/038a91b73676.jpg',
    hostelCount: '612 hostels',
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4dd7bfc4daa4.jpg',
    hostelCount: '755 hostels',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c33e2f14dda0.jpg',
    hostelCount: '389 hostels',
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bbaca76d7bdd.jpg',
    hostelCount: '298 hostels',
  },
  {
    city: 'Prague',
    country: 'Czech Republic',
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/79c663eef5e4.jpg',
    hostelCount: '210 hostels',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/941b923be0c7.jpg',
    hostelCount: '340 hostels',
  },
  {
    city: 'Sydney',
    country: 'Australia',
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ce67717573df.jpeg',
    hostelCount: '175 hostels',
  },
]

export const HOSTEL_TYPES = [
  { value: 'backpacker', label: 'Backpacker' },
  { value: 'boutique', label: 'Boutique' },
  { value: 'party', label: 'Party' },
  { value: 'chill', label: 'Chill' },
] as const

export const AMENITY_OPTIONS = [
  'Free WiFi',
  'Breakfast',
  'Bar',
  'Shared Kitchen',
  'Lockers',
  'Air Conditioning',
  'Laundry',
  'Rooftop Terrace',
  'Luggage Storage',
  '24/7 Reception',
] as const

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating_desc', label: 'Top rated' },
  { value: 'distance_asc', label: 'Closest to center' },
]
