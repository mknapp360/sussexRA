import { useEffect, useState } from 'react'

interface Slot { start: string; end: string }

interface BookingFormData {
  name: string
  email: string
  notes: string
}

export default function BookingCalendar({
  calendarId,
  duration = 60,
  step = duration,
  timezone = 'Europe/London',
  title = 'Book a Session',
  onBooked,
  allowBooking = false,
  serviceName,
  servicePrice = '£60',
}: {
  calendarId?: string
  duration?: number
  step?: number
  timezone?: string
  title?: string
  onBooked?: (payload: { start: string; end: string; eventId?: string; htmlLink?: string }) => void
  allowBooking?: boolean
  serviceName?: string
  servicePrice?: string
}) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Booking form state
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [formData, setFormData] = useState<BookingFormData>({ name: '', email: '', notes: '' })
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

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

  const pretty = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: timezone 
  })

  const prettyDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone
  })

  function handleSlotClick(slot: Slot) {
    setSelectedSlot(slot)
    setBookingSuccess(false)
    setFormData({ name: '', email: '', notes: '' })
  }

  function closeModal() {
    setSelectedSlot(null)
    setBookingSuccess(false)
    setFormData({ name: '', email: '', notes: '' })
  }

  async function handleSubmitBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot || !allowBooking) return

    setBookingInProgress(true)
    try {
      const res = await fetch('/api/gcal/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendarId,
          title: `${serviceName} — ${formData.name}`,
          description: `
Booking Details:
- Service: ${serviceName}
- Client: ${formData.name}
- Email: ${formData.email}
- Price: ${servicePrice}
${formData.notes ? `\nSpecial Requests:\n${formData.notes}` : ''}

Booked via TarotPathwork.com on ${new Date().toLocaleString()}
          `.trim(),
          start: selectedSlot.start,
          end: selectedSlot.end,
          attendeeEmail: formData.email,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Booking failed')
      
      setBookingSuccess(true)
      onBooked?.({ 
        start: selectedSlot.start, 
        end: selectedSlot.end, 
        eventId: json.eventId, 
        htmlLink: json.htmlLink 
      })
      
      // Refresh slots to remove the booked one
      setTimeout(() => {
        const qs = new URLSearchParams({ date, tz: timezone, duration: String(duration), step: String(step) })
        if (calendarId) qs.set('calendarId', calendarId)
        fetch(`/api/gcal/availability?${qs.toString()}`)
          .then(r => r.json())
          .then(json => setSlots(json.slots))
      }, 1000)
      
    } catch (e: any) {
      alert(`Booking failed: ${e.message}`)
    } finally {
      setBookingInProgress(false)
    }
  }

  function shiftDay(delta: number) {
    const d = new Date(date)
    d.setDate(d.getDate() + delta)
    setDate(d.toISOString().slice(0, 10))
  }

  return (
    <>
      <div className="border rounded-2xl p-4 shadow-sm bg-white/70 dark:bg-black/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-xl border hover:bg-gray-50" onClick={() => shiftDay(-1)}>◀</button>
            <input
              type="date"
              className="px-3 py-1 rounded-xl border"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="px-3 py-1 rounded-xl border hover:bg-gray-50" onClick={() => shiftDay(1)}>▶</button>
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
                    className="border rounded-xl px-3 py-2 hover:bg-tpgold/10 hover:border-tpgold transition"
                    onClick={() => handleSlotClick(slot)}
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

      {/* Booking Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!bookingSuccess ? (
              <>
                <h3 className="text-2xl font-semibold mb-4">Book Your Session</h3>
                
                <div className="mb-4 p-3 bg-tpblue/10 rounded-xl">
                  <p className="text-sm text-tpblue font-medium">{serviceName}</p>
                  <p className="text-lg font-semibold">{prettyDate(selectedSlot.start)}</p>
                  <p className="text-tpgold font-medium">
                    {pretty(selectedSlot.start)} – {pretty(selectedSlot.end)}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">Price: {servicePrice}</p>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-tpgold"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-tpgold"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                    <p className="text-xs text-slate-500 mt-1">We'll send confirmation to this email</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Special Requests (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-tpgold"
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any specific areas you'd like to focus on?"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                    <strong>Note:</strong> This reserves your time slot. Payment will be collected separately via the link sent to your email.
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50"
                      disabled={bookingInProgress}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-tpgold text-white rounded-xl hover:opacity-90 disabled:opacity-50"
                      disabled={bookingInProgress}
                    >
                      {bookingInProgress ? 'Booking...' : 'Reserve Time Slot'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="mb-4 text-green-600 text-5xl">✓</div>
                  <h3 className="text-2xl font-semibold mb-2">Booking Confirmed!</h3>
                  <p className="text-slate-600 mb-4">
                    Your time slot has been reserved for:
                  </p>
                  <div className="mb-4 p-3 bg-green-50 rounded-xl">
                    <p className="font-medium">{prettyDate(selectedSlot.start)}</p>
                    <p className="text-tpgold font-semibold">
                      {pretty(selectedSlot.start)} – {pretty(selectedSlot.end)}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 mb-6">
                    A confirmation email with payment details has been sent to <strong>{formData.email}</strong>
                  </p>
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 bg-tpgold text-white rounded-xl hover:opacity-90"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}