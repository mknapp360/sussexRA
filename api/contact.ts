// /api/contact.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

type Payload = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  message?: string
  company?: string // honeypot
  subscribe?: boolean // optional opt-in if you add a checkbox later
}

function isEmail(v?: string) {
  if (!v) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
      subscribe = true,
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
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL
    const supabaseAnon = process.env.SUPABASE_ANON_KEY
    const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY
    const functionName = process.env.CONTACT_FUNCTION_NAME || 'send-contact'

    if (!supabaseUrl || !supabaseAnon) {
      return res.status(500).json({
        error: 'Supabase config missing',
        details: 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_ANON_KEY not set',
      })
    }
    if (!supabaseService) {
      return res.status(500).json({
        error: 'Service role key missing',
        details: 'SUPABASE_SERVICE_ROLE_KEY not set in Vercel',
      })
    }

    // --- 1) Email via Supabase Edge Function (SendGrid) ---
    const efResp = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${supabaseAnon}`,
      },
      body: JSON.stringify({
        to: to || 'fraterlucis@tarotpathwork.com',
        subject:
          subject ||
          `New contact form message from ${firstName} ${lastName || ''}`.trim(),
        from: email,
        phone,
        message,
        meta: {
          name: `${firstName} ${lastName || ''}`.trim(),
          origin: (req.headers['origin'] as string) || '',
          ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
          userAgent: (req.headers['user-agent'] as string) || '',
          path: (req.headers['referer'] as string) || '',
        },
      }),
    })

    const efText = await efResp.text()
    if (!efResp.ok) {
      // Surface the exact reason (e.g., SendGrid 401/400, missing env in Edge Function, etc.)
      return res.status(502).json({ error: 'Edge function error', details: efText })
    }

    // --- 2) Insert into Supabase (subscribers) ---
    // Schema expected:
    // create table subscribers (
    //   id uuid primary key default uuid_generate_v4(),
    //   first_name text,
    //   last_name text,
    //   email text not null unique,
    //   phone text,
    //   message text,
    //   source text default 'contact_form',
    //   subscribed boolean default true,
    //   created_at timestamptz default now()
    // );
    //
    // If RLS enabled, ensure a policy for service role or simply keep RLS disabled for this table.

    const insertResp = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnon,
        Authorization: `Bearer ${supabaseService}`, // service role for insert regardless of RLS
        Prefer: 'return=representation', // get back row to help debug uniqueness errors
      },
      body: JSON.stringify({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim(),
        source: 'contact_form',
        subscribed: !!subscribe,
      }),
    })

    if (!insertResp.ok) {
      const details = await insertResp.text()
      // Common: 409 duplicate key on unique email — treat as success for UX, but return info
      if (insertResp.status === 409) {
        return res.status(200).json({
          ok: true,
          info: 'Email already exists in subscribers (treated as success).',
        })
      }
      return res.status(500).json({ error: 'DB insert error', details })
    }

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('CONTACT API ERROR:', err)
    return res
      .status(500)
      .json({ error: 'Server error', details: err?.message || String(err) })
  }
}
