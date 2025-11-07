// api/share/[slug].ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import fetch from 'node-fetch'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { slug } = req.query as { slug: string }
    if (!slug) return res.status(400).send('Missing slug')

    // fetch post (by slug first, else by id)
    const endpoint = `${SUPABASE_URL}/rest/v1/posts?select=*&published=eq.true&or=(slug.eq.${encodeURIComponent(slug)},id.eq.${encodeURIComponent(slug)})&limit=1`
    const r = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY as string,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })
    const data = await r.json()
    const post = Array.isArray(data) ? data[0] : null
    if (!post) return res.status(404).send('Post not found')

    const site = 'https://www.tarotpathwork.com' // <- set your canonical domain
    const postUrl = `${site}/post/${post.slug || post.id}`
    const title = post.title || 'Tarot Pathwork'
    const description =
      post.excerpt ||
      (post.content || '').replace(/<[^>]*>/g, '').slice(0, 180) + '…'
    const image = `${site}/api/og/${post.slug || post.id}`;

    // minimal HTML with OG + Twitter tags; then redirect the human
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<link rel="canonical" href="${postUrl}">
<meta name="description" content="${escapeHtml(description)}">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="Tarot Pathwork">
<meta property="og:url" content="${postUrl}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${image}">
<meta property="article:published_time" content="${post.published_at || ''}">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${image}">

<!-- send humans to the SPA -->
<meta http-equiv="refresh" content="0; url=${postUrl}">
<style>html,body{background:#0b0b0b;color:#fff}</style>
</head>
<body>
  <p>Redirecting to <a href="${postUrl}">${postUrl}</a>…</p>
</body>
</html>`

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    // Allow scrapers to cache for a while
    res.setHeader('Cache-Control', 'public, max-age=600')
    return res.status(200).send(html)
  } catch (e) {
    console.error(e)
    return res.status(500).send('Server error')
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}