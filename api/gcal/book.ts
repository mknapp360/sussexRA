// Fixed: api/gcal/book.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis'

function getWriteClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n')
  if (!clientEmail || !privateKey) throw new Error('Missing Google service account env vars')
  
  const jwt = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
  return google.calendar({ version: 'v3', auth: jwt })
}

// IMPORTANT: Must be default export for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
    
    const { calendarId = process.env.GOOGLE_CALENDAR_ID, title, description, start, end, attendeeEmail } = req.body || {}
    
    if (!calendarId || !start || !end || !title) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const calendar = getWriteClient()
    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: title,
        description,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees: attendeeEmail ? [{ email: attendeeEmail }] : undefined,
      },
      conferenceDataVersion: 1,
    })

    return res.json({ 
      ok: true, 
      eventId: event.data.id, 
      htmlLink: event.data.htmlLink 
    })
  } catch (err: any) {
    console.error('Booking error:', err)
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}