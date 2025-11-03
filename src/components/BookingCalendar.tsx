
// =============================
// FILE: src/components/BookingCalendar.tsx
// Frontend component to show a date picker + available slots from your API.
// Import into each reading detail page and pass props like duration and label.
// =============================
import { useEffect, useState } from 'react'

interface Slot { start: string; end: string }

export default function BookingCalendar({
  calendarId,
  duration = 60,
  step = duration,
  timezone = 'Europe/London',
  title = 'Book a Session',
  onBooked,
  allowBooking = false,
  serviceName,
}: {
  calendarId?: string
  duration?: number
  step?: number
  timezone?: string
  title?: string
  onBooked?: (payload: { start: string; end: string; eventId?: string; htmlLink?: string }) => void
  allowBooking?: boolean
  serviceName?: string
}) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true); setError(null)
      try {
        const qs = new URLSearchParams({ date, tz: timezone, duration: String(duration), step: String(step) })
        if (calendarId) qs.set('calendarId', calendarId)
        const res = await fetch(`/api/gcal/availability?${qs.toString()}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to load availability')
        if (!cancelled) setSlots(json.slots)
      } catch (e: any) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [date, calendarId, duration, step, timezone])

  const pretty = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  async function book(slot: Slot) {
    if (!allowBooking) return
    try {
      const res = await fetch('/api/gcal/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendarId,
          title: serviceName ? `${serviceName} — Tarot Pathwork` : 'Tarot Pathwork Session',
          description: `Booked via TarotPathwork.com on ${new Date().toLocaleString()}`,
          start: slot.start,
          end: slot.end,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Booking failed')
      onBooked?.({ start: slot.start, end: slot.end, eventId: json.eventId, htmlLink: json.htmlLink })
      alert('Booked! A calendar event has been created.')
    } catch (e: any) {
      alert(e.message)
    }
  }

  // Simple month navigator

  function shiftDay(delta: number) {
    const d = new Date(date)
    d.setDate(d.getDate() + delta)
    setDate(d.toISOString().slice(0, 10))
  }

  return (
    <div className="border rounded-2xl p-4 shadow-sm bg-white/70 dark:bg-black/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-xl border" onClick={() => shiftDay(-1)}>◀</button>
          <input
            type="date"
            className="px-3 py-1 rounded-xl border"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="px-3 py-1 rounded-xl border" onClick={() => shiftDay(1)}>▶</button>
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading availability…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div>
          {slots.length === 0 ? (
            <p className="text-sm text-slate-600">No slots available for this day.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.start}
                  className="border rounded-xl px-3 py-2 hover:bg-slate-50"
                  onClick={() => (allowBooking ? book(slot) : onBooked?.(slot))}
                >
                  {pretty(slot.start)} – {pretty(slot.end)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">Times shown in {timezone}.</p>
    </div>
  )
}

// =============================
// USAGE EXAMPLE (inside a reading detail page component)
//
// import BookingCalendar from '@/components/BookingCalendar'
// ...
// <BookingCalendar
//   calendarId={import.meta.env.VITE_PUBLIC_GCAL_ID}
//   duration={60}
//   step={60}
//   timezone="Europe/London"
//   title="Book this Session"
//   allowBooking={false} // set to true after you plug in /api/gcal/book
//   serviceName="1 Hour Spiritual Session"
//   onBooked={(slot) => console.log('selected', slot)}
// />
//
// =============================
// ENV VARS to add on Vercel (Project Settings → Environment Variables):
// GOOGLE_SERVICE_ACCOUNT_EMAIL
// GOOGLE_SERVICE_ACCOUNT_KEY   (paste the JSON private_key value, make sure \n are preserved)
// GOOGLE_CALENDAR_ID           (the calendar you want to read)
// VITE_PUBLIC_GCAL_ID          (optional: expose the calendar id to the client)
//
// FINAL STEP: In Google Calendar, share the target calendar with your
// service account email ("See all event details" at minimum).
