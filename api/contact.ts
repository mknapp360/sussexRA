// /api/contact.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add detailed logging
  console.log('=== CONTACT API CALLED ===')
  console.log('Method:', req.method)
  console.log('Body:', JSON.stringify(req.body))
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { to, subject, payload } = req.body ?? {}
    const { firstName, lastName, email, phone, message, company } = payload ?? {}

    console.log('Parsed payload:', { firstName, email, hasMessage: !!message })

    if (company) return res.status(200).json({ ok: true }) // honeypot
    if (!firstName || !email || !message) {
      console.log('Missing required fields')
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnon = process.env.SUPABASE_ANON_KEY
    const fn = process.env.CONTACT_FUNCTION_NAME || 'send-contact'

    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnon: !!supabaseAnon,
      functionName: fn,
      supabaseUrlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING'
    })

    if (!supabaseUrl || !supabaseAnon) {
      console.error('ERROR: Missing Supabase environment variables')
      return res.status(500).json({ error: 'Missing Supabase env vars' })
    }

    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/${fn}`
    console.log('Calling edge function:', edgeFunctionUrl)

    const edgeResp = await fetch(edgeFunctionUrl, {
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
      }),
    })

    const text = await edgeResp.text()

    // Log so you can see this in Vercel function logs
    console.log('Edge function status:', edgeResp.status)
    console.log('Edge function response:', text)

    if (!edgeResp.ok) {
      console.error('Edge function error:', {
        status: edgeResp.status,
        statusText: edgeResp.statusText,
        response: text
      })
      return res
        .status(edgeResp.status)
        .json({ error: 'Edge function error', details: text })
    }

    console.log('SUCCESS: Email sent via edge function')
    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('CONTACT API ERROR:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name
    })
    return res
      .status(500)
      .json({ error: 'Server error', details: err?.message || String(err) })
  }
}