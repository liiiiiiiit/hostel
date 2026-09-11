'use client'

import { BookingsView } from '@/components/hostel/bookings-view'
import { DetailView } from '@/components/hostel/detail-view'
import { HomeView } from '@/components/hostel/home-view'
import { SearchView } from '@/components/hostel/search-view'
import { SiteFooter } from '@/components/hostel/site-footer'
import { SiteHeader } from '@/components/hostel/site-header'
import { useWorldHostel } from '@/lib/store'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function Home() {
  const { view, selectedSlug } = useWorldHostel()

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view, selectedSlug])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {view === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <HomeView />
          </motion.div>
        )}
        {view === 'search' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <SearchView />
          </motion.div>
        )}
        {view === 'detail' && (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <DetailView />
          </motion.div>
        )}
        {view === 'bookings' && (
          <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            <BookingsView />
          </motion.div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
