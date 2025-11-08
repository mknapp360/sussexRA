// api/stripe/webhook.ts
// Handles Stripe webhook events (payment success)
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { google } from 'googleapis'

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

export const config = {
  api: {
    bodyParser: false, // Stripe needs raw body
  },
}

async function buffer(readable: any) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const metadata = session.metadata!
      
      // Create calendar event
      const calendar = getGoogleCalendarClient()
      const calendarId = process.env.GOOGLE_CALENDAR_ID

      await calendar.events.insert({
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

      console.log('✓ Calendar event created for', metadata.customerEmail)

      // TODO: Send confirmation email here (next step)
      
      return res.json({ received: true })
    } catch (error: any) {
      console.error('Error processing payment:', error)
      return res.status(500).json({ error: error.message })
    }
  }

  return res.json({ received: true })
}