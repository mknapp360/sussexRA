// api/stripe/webhook.ts
// Handles Stripe webhook events (payment success)
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { google } from 'googleapis'
import { Readable } from 'stream'

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

// This tells Vercel not to parse the body
export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  const reader = req as unknown as Readable
  
  for await (const chunk of reader) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Webhook received:', req.method)
  
  if (req.method !== 'POST') {
    console.log('Method not POST, returning 405')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const rawBody = await getRawBody(req)
    const sig = req.headers['stripe-signature']

    console.log('Signature present:', !!sig)
    console.log('Raw body length:', rawBody.length)

    if (!sig) {
      console.log('Missing signature header')
      return res.status(400).json({ error: 'Missing stripe-signature header' })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      console.log('Event verified:', event.type)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return res.status(400).json({ error: `Webhook Error: ${err.message}` })
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      console.log('Processing checkout.session.completed')
      const session = event.data.object as Stripe.Checkout.Session

      try {
        const metadata = session.metadata
        
        if (!metadata) {
          console.error('No metadata in session')
          return res.status(400).json({ error: 'Missing metadata' })
        }

        console.log('Creating calendar event for:', metadata.customerEmail)
        
        // Create calendar event
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

        // TODO: Send confirmation email here (next step)
        
        return res.status(200).json({ received: true, eventId: eventResult.data.id })
      } catch (error: any) {
        console.error('Error processing payment:', error)
        return res.status(500).json({ error: error.message })
      }
    }

    console.log('Event type not handled:', event.type)
    return res.status(200).json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return res.status(500).json({ error: error.message })
  }
}