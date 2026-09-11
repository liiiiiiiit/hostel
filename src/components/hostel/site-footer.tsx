'use client'

import { Separator } from '@/components/ui/separator'
import { DESTINATIONS } from '@/lib/constants'
import { useWorldHostel } from '@/lib/store'
import { Globe2, Instagram, Twitter, Youtube } from 'lucide-react'

const COMPANY_LINKS = ['About us', 'Careers', 'Press', 'Sustainability']
const SUPPORT_LINKS = ['Help center', 'Safety', 'Cancellation options', 'Contact']

export function SiteFooter() {
  const { setFilter, navigate, view } = useWorldHostel()

  function browseCity(city: string) {
    setFilter('city', city)
    setFilter('q', '')
    if (view !== 'search') navigate('search')
  }

  return (
    <footer className="mt-auto border-t bg-secondary/60 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Globe2 className="size-5" aria-hidden />
              </span>
              <span className="text-lg font-bold tracking-tight">WorldHostel</span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              The home of budget travel. Book beds in 23,000 hostels across 170 countries —
              and meet the world along the way.
            </p>
            <div className="mt-1 flex gap-2" aria-label="Social media">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <span
                  key={i}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background text-muted-foreground transition hover:text-primary"
                  role="img"
                  aria-label={['Instagram', 'Twitter', 'YouTube'][i]}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Company">
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {COMPANY_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className="transition hover:text-primary">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="mb-3 text-sm font-semibold">Support</h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {SUPPORT_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className="transition hover:text-primary">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Top destinations">
            <h3 className="mb-3 text-sm font-semibold">Top destinations</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {DESTINATIONS.map((d) => (
                <li key={d.city}>
                  <button
                    type="button"
                    onClick={() => browseCity(d.city)}
                    className="transition hover:text-primary"
                  >
                    Hostels in {d.city}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} WorldHostel. All rights reserved.</p>
          <p>Best price guarantee · Free cancellation on most rooms · 24/7 global support</p>
        </div>
      </div>
    </footer>
  )
}
