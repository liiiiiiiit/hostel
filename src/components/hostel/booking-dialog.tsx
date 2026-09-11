'use client'

import { useMutation } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createBooking } from '@/lib/api'
import { useWorldHostel } from '@/lib/store'
import type { HostelDetail, Room } from '@/lib/types'
import { CheckCircle2, Loader2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

interface BookingDialogProps {
  hostel: HostelDetail
  room: Room | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function BookingDialog({ hostel, room, open, onOpenChange }: BookingDialogProps) {
  const { guestSearch, setBookingEmail, navigate } = useWorldHostel()
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      setConfirmedCode(data.booking.code)
      toast.success('Booking confirmed!', { description: `Code ${data.booking.code}` })
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Booking failed')
    },
  })

  const nights =
    Math.round(
      (new Date(`${guestSearch.checkOut}T00:00:00Z`).getTime() -
        new Date(`${guestSearch.checkIn}T00:00:00Z`).getTime()) /
        86_400_000
    ) || 0
  const totalPrice = room ? nights * room.pricePerNight : 0

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!room) return
    if (guestName.trim().length < 2) {
      toast.error('Please enter the guest name')
      return
    }
    if (!EMAIL_RE.test(guestEmail)) {
      toast.error('Please enter a valid email address')
      return
    }
    mutation.mutate({
      hostelId: hostel.id,
      roomId: room.id,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      checkIn: guestSearch.checkIn,
      checkOut: guestSearch.checkOut,
      guests: guestSearch.guests,
    })
  }

  function closeAndReset() {
    onOpenChange(false)
    setTimeout(() => {
      setConfirmedCode(null)
      mutation.reset()
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(v) : closeAndReset())}>
      <DialogContent className="sm:max-w-md">
        {confirmedCode ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
              <CheckCircle2 className="size-9 text-emerald-600" aria-hidden />
            </span>
            <DialogHeader className="items-center">
              <DialogTitle className="text-xl">Booking confirmed!</DialogTitle>
              <DialogDescription>
                A confirmation email is on its way to {guestEmail}
              </DialogDescription>
            </DialogHeader>
            <div className="w-full rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3">
              <p className="text-xs text-muted-foreground">Your booking code</p>
              <p className="font-mono text-2xl font-bold tracking-wider text-primary">{confirmedCode}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {hostel.name} · {guestSearch.checkIn} → {guestSearch.checkOut} · {nights}{' '}
              {nights === 1 ? 'night' : 'nights'}
            </p>
            <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1"
                onClick={() => {
                  setBookingEmail(guestEmail.trim().toLowerCase())
                  closeAndReset()
                  navigate('bookings')
                }}
              >
                View my bookings
              </Button>
              <Button variant="outline" className="flex-1" onClick={closeAndReset}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book your stay</DialogTitle>
              <DialogDescription>
                {hostel.name} — {hostel.city}, {hostel.country}
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl bg-secondary/70 p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{room?.name}</p>
                <Badge variant="outline" className="capitalize">
                  {room?.type}
                </Badge>
              </div>
              <Separator className="my-3" />
              <dl className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dates</dt>
                  <dd>
                    {guestSearch.checkIn} → {guestSearch.checkOut}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Guests</dt>
                  <dd className="flex items-center gap-1">
                    <Users className="size-3.5" aria-hidden /> {guestSearch.guests}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Price</dt>
                  <dd>
                    ${room?.pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}
                  </dd>
                </div>
              </dl>
              <Separator className="my-3" />
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span className="text-lg text-primary">${totalPrice}</span>
              </div>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4" id="booking-form">
              <div className="flex flex-col gap-2">
                <Label htmlFor="guest-name">Guest name</Label>
                <Input
                  id="guest-name"
                  placeholder="e.g. Alex Traveler"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="guest-email">Email</Label>
                <Input
                  id="guest-email"
                  type="email"
                  placeholder="you@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your confirmation and booking code will be sent here.
                </p>
              </div>

              <Button type="submit" size="lg" className="font-semibold" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Confirming…
                  </>
                ) : (
                  `Confirm booking · $${totalPrice}`
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {hostel.freeCancellation
                  ? 'Free cancellation up to 48h before check-in.'
                  : 'Non-refundable rate.'}{' '}
                You won&apos;t be charged yet.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
