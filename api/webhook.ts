// api/webhook.ts - Handles raw body for Stripe signature verification
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { google } from 'googleapis'
import { buffer } from 'micro'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

function getGoogleCalendarClient() {
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

// Disable body parsing so we can get raw body
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== Webhook called ===')
  
  if (req.method !== 'POST') {
    return res.status(200).json({ message: 'Webhook endpoint ready' })
  }

  try {
    const sig = req.headers['stripe-signature']
    
    if (!sig) {
      console.error('Missing stripe-signature')
      return res.status(400).json({ error: 'Missing stripe-signature header' })
    }

    // Get raw body using micro's buffer function
    const buf = await buffer(req)
    
    console.log('Raw buffer length:', buf.length)

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      console.log('✓ Event verified:', event.type)
    } catch (err: any) {
      console.error('Verification failed:', err.message)
      return res.status(400).json({ error: `Webhook Error: ${err.message}` })
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      console.log('Processing checkout...')
      const session = event.data.object as Stripe.Checkout.Session

      const metadata = session.metadata
      
      if (!metadata) {
        console.error('No metadata')
        return res.status(400).json({ error: 'Missing metadata' })
      }

      console.log('Creating calendar event for:', metadata.customerEmail)
      
      try {
        const calendar = getGoogleCalendarClient()
        const calendarId = process.env.GOOGLE_CALENDAR_ID

        const eventResult = await calendar.events.insert({
          calendarId,
          requestBody: {
            summary: `${metadata.serviceName} — ${metadata.customerName}`,
            description: `
Booking Details:
- Service: ${metadata.serviceName}
- Client: ${metadata.customerName}
- Email: ${metadata.customerEmail}
- Payment: PAID ✓ (Stripe Session: ${session.id})
${metadata.notes ? `\nSpecial Requests:\n${metadata.notes}` : ''}

Booked and paid via TarotPathwork.com
Payment processed: ${new Date().toLocaleString()}
            `.trim(),
            start: { dateTime: metadata.slotStart },
            end: { dateTime: metadata.slotEnd },
          },
        })

        console.log('✓ Calendar event created:', eventResult.data.id)
        
        return res.status(200).json({ 
          received: true, 
          eventId: eventResult.data.id 
        })
      } catch (error: any) {
        console.error('Calendar error:', error)
        return res.status(500).json({ error: error.message })
      }
    }

    return res.status(200).json({ received: true })
    
  } catch (error: any) {
    console.error('Handler error:', error)
    return res.status(500).json({ error: error.message })
  }
}