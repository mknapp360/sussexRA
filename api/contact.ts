// /api/contact.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

type Payload = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  message?: string
  company?: string // honeypot
}

function isEmail(v?: string) {
  if (!v) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== CONTACT API CALLED ===')
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { to, subject, payload } = (req.body ?? {}) as {
      to?: string
      subject?: string
      payload?: Payload
    }

    if (!payload) {
      return res.status(400).json({ error: 'Missing payload' })
    }

    const {
      firstName = '',
      lastName = '',
      email = '',
      phone = '',
      message = '',
      company = '',
    } = payload

    // Honeypot: quietly succeed to avoid tipping off bots
    if (company) return res.status(200).json({ ok: true })

    if (!firstName.trim() || !message.trim() || !isEmail(email)) {
      return res.status(400).json({
        error: 'Invalid fields',
        details: 'firstName, valid email, and message are required.',
      })
    }

    // --- ENV ---
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseAnon = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
    const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY
    const functionName = process.env.CONTACT_FUNCTION_NAME || 'send-contact'

    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnon: !!supabaseAnon,
      hasSupabaseService: !!supabaseService,
    })

    if (!supabaseUrl || !supabaseAnon) {
      return res.status(500).json({
        error: 'Supabase config missing',
        details: 'SUPABASE_URL or SUPABASE_ANON_KEY not set',
      })
    }

    // --- 1) Send Email via Supabase Edge Function (SendGrid) ---
    console.log('Sending email via edge function...')
    const efResp = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${supabaseAnon}`,
      },
      body: JSON.stringify({
        to: to || 'martinknapp@sussexmasons.org.uk',
        subject:
          subject ||
          `New contact form message from ${firstName} ${lastName || ''}`.trim(),
        from: email,
        phone,
        message,
        meta: {
          name: `${firstName} ${lastName || ''}`.trim(),
          origin: (req.headers['origin'] as string) || '',
          userAgent: (req.headers['user-agent'] as string) || '',
        },
      }),
    })

    const efText = await efResp.text()
    console.log('Edge function response:', efResp.status, efText)
    
    if (!efResp.ok) {
      return res.status(502).json({ error: 'Edge function error', details: efText })
    }

    // --- 2) Insert into Supabase Database (subscribers table) ---
    // Only attempt if service role key is available
    if (supabaseService) {
      console.log('Inserting subscriber into database...')
      
      const insertResp = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnon,
          Authorization: `Bearer ${supabaseService}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          message: message.trim(),
          source: 'contact_form',
          subscribed: true,
        }),
      })

      if (!insertResp.ok) {
        const details = await insertResp.text()
        console.error('DB insert error:', insertResp.status, details)
        
        // If duplicate email (409), treat as success for better UX
        if (insertResp.status === 409) {
          console.log('Duplicate email - treating as success')
          return res.status(200).json({
            ok: true,
            info: 'Email already subscribed',
          })
        }
        
        // For other errors, still return success to user but log the error
        // (Don't want to expose database errors to frontend)
        console.error('Failed to save to database, but email was sent')
      } else {
        console.log('Successfully saved to database')
      }
    } else {
      console.log('Skipping database insert - no service role key')
    }

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('CONTACT API ERROR:', err)
    return res
      .status(500)
      .json({ error: 'Server error', details: err?.message || String(err) })
  }
}