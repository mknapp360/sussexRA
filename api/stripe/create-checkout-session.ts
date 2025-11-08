// api/stripe/create-checkout-session.ts
// Creates a Stripe Checkout session for booking payment
import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Add this check early to prevent crashes from missing env vars
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY environment variable is missing')
    return res.status(500).json({ error: 'Stripe configuration missing. Please check your environment variables.' })
  }

  let stripe: Stripe
  try {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  } catch (error: any) {
    console.error('Failed to initialize Stripe:', error.message)
    return res.status(500).json({ error: 'Failed to initialize payment processor' })
  }

  try {
    const { 
      serviceName, 
      servicePrice, 
      name, 
      email, 
      notes,
      slotStart, 
      slotEnd,
      timezone 
    } = req.body

    if (!serviceName || !servicePrice || !name || !email || !slotStart || !slotEnd) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Parse price (remove £ symbol and convert to pence)
    const priceInPounds = parseInt(servicePrice.replace('£', ''))
    const priceInPence = priceInPounds * 100

    // Format dates for display
    const startDate = new Date(slotStart)
    const formattedDate = startDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    })
    const formattedTime = `${startDate.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone
    })} – ${new Date(slotEnd).toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone
    })}`

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: serviceName,
              description: `${formattedDate}\n${formattedTime}`,
            },
            unit_amount: priceInPence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.PUBLIC_BASE_URL || 'https://tarotpathwork.com'}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_BASE_URL || 'https://tarotpathwork.com'}/readings/recorded-reading`,
      customer_email: email,
      metadata: {
        serviceName,
        customerName: name,
        customerEmail: email,
        notes: notes || '',
        slotStart,
        slotEnd,
        timezone,
      },
    })

    return res.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' })
  }
}