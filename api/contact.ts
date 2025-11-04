// /api/contact.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { to, subject, payload } = req.body ?? {}
    const { firstName, lastName, email, phone, message, company } = payload ?? {}

    if (company) return res.status(200).json({ ok: true }) // honeypot
    if (!firstName || !email || !message)
      return res.status(400).json({ error: 'Missing required fields' })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnon = process.env.SUPABASE_ANON_KEY
    const fn = process.env.CONTACT_FUNCTION_NAME || 'send-contact'

    if (!supabaseUrl || !supabaseAnon)
      return res.status(500).json({ error: 'Missing Supabase env vars' })

    const edgeResp = await fetch(`${supabaseUrl}/functions/v1/${fn}`, {
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
    console.error('EDGE FUNCTION RESPONSE:', text)

    if (!edgeResp.ok) {
      return res
        .status(edgeResp.status)
        .json({ error: 'Edge function error', details: text })
    }

    return res.status(200).json({ ok: true })
  } catch (err: any) {
    console.error('CONTACT API ERROR:', err)
    return res
      .status(500)
      .json({ error: 'Server error', details: err?.message || String(err) })
  }
}
