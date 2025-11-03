// =============================
// FILE: /api/gcal/availability.ts
// Serverless function (Vercel) to read your Google Calendar busy times
// and return bookable free slots for a given day.
// =============================
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google, calendar_v3 } from 'googleapis'

// Helper to init Google JWT client from env
function getGoogleClient(): calendar_v3.Calendar {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n')
  if (!clientEmail || !privateKey) throw new Error('Missing Google service account env vars')

  const jwt = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  })
  return google.calendar({ version: 'v3', auth: jwt }) as calendar_v3.Calendar
}

// Build slots of `duration` between `startOfDay` and `endOfDay`,
// excluding any that overlap a busy interval
function buildFreeSlots({
  startOfDay,
  endOfDay,
  durationMin,
  busy,
  stepMin = durationMin, // set to e.g. 30 for rolling 30-min start times
}: {
  startOfDay: Date
  endOfDay: Date
  durationMin: number
  busy: Array<{ start: Date; end: Date }>
  stepMin?: number
}) {
  const slots: Array<{ start: string; end: string }> = []
  const stepMs = stepMin * 60 * 1000
  const durMs = durationMin * 60 * 1000

  for (let t = startOfDay.getTime(); t + durMs <= endOfDay.getTime(); t += stepMs) {
    const s = new Date(t)
    const e = new Date(t + durMs)

    const overlapsBusy = busy.some(({ start, end }) => !(e <= start || s >= end))
    if (!overlapsBusy) slots.push({ start: s.toISOString(), end: e.toISOString() })
  }
  return slots
}

// Default working hours per weekday (0=Sun ... 6=Sat). Override with query if you like.
const DEFAULT_WORKING_HOURS: Record<number, { start: string; end: string } | null> = {
  0: null, // Sunday closed
  1: { start: '10:00', end: '18:00' },
  2: { start: '10:00', end: '18:00' },
  3: { start: '10:00', end: '18:00' },
  4: { start: '10:00', end: '18:00' },
  5: { start: '10:00', end: '18:00' },
  6: { start: '10:00', end: '14:00' },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

    const calendarId = (req.query.calendarId as string) || process.env.GOOGLE_CALENDAR_ID
    if (!calendarId) return res.status(400).json({ error: 'Missing calendarId' })

    const tz = (req.query.tz as string) || 'Europe/London'
    const dateStr = req.query.date as string // e.g. '2025-11-04'
    if (!dateStr) return res.status(400).json({ error: 'Missing date (YYYY-MM-DD)' })

    const duration = parseInt((req.query.duration as string) || '60', 10) // minutes
    const step = parseInt((req.query.step as string) || String(duration), 10)

    // Working hours — optional overrides via query like ?opens=10:00&closes=18:00
    const date = new Date(`${dateStr}T00:00:00`)
    const dow = date.getUTCDay()
    const customOpen = (req.query.opens as string) || undefined
    const customClose = (req.query.closes as string) || undefined

    const hoursCfg = DEFAULT_WORKING_HOURS[dow]
    const dayHours = hoursCfg && {
      start: customOpen || hoursCfg.start,
      end: customClose || hoursCfg.end,
    }

    if (!dayHours) {
      return res.json({ date: dateStr, timezone: tz, slots: [] })
    }

    // Construct day start/end in requested TZ
    const startOfDay = new Date(`${dateStr}T${dayHours.start}:00`)
    const endOfDay = new Date(`${dateStr}T${dayHours.end}:00`)

    // Google FreeBusy requires UTC ISO strings
    const timeMin = new Date(startOfDay).toISOString()
    const timeMax = new Date(endOfDay).toISOString()

    const cal = getGoogleClient()
    const fb = await cal.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: tz,
        items: [{ id: calendarId }],
      },
    })

    const busy = (fb.data.calendars?.[calendarId]?.busy || []).map((b) => ({
      start: new Date(b.start!),
      end: new Date(b.end!),
    }))

    const slots = buildFreeSlots({ startOfDay, endOfDay, durationMin: duration, busy, stepMin: step })

    return res.json({ date: dateStr, timezone: tz, duration, slots })
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}