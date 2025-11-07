// api/cron/sync-analytics.ts
// This endpoint should be called by Vercel Cron (configured in vercel.json)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Verify this is a cron request (optional but recommended)
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const PROPERTY_ID = process.env.GA4_PROPERTY_ID!;
    const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL!;
    const PRIVATE_KEY = process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, '\n');
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Initialize GA4 client
    const gaClient = new BetaAnalyticsDataClient({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    });

    // Initialize Supabase with service role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get pageviews from GA4 (last 30 days)
    const [report] = await gaClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: '/blog/',
          },
        },
      },
      limit: 1000,
    });

    // Build analytics map
    const analyticsMap: Record<string, number> = {};
    (report.rows ?? []).forEach(row => {
      const pagePath = row.dimensionValues?.[0]?.value ?? '';
      const views = Number(row.metricValues?.[0]?.value ?? 0);
      
      const match = pagePath.match(/\/blog\/([^/?]+)/);
      if (match && match[1]) {
        const slug = match[1];
        analyticsMap[slug] = (analyticsMap[slug] || 0) + views;
      }
    });

    // Get all posts from database
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug');

    if (fetchError) throw fetchError;

    // Update each post with GA data
    let updated = 0;
    for (const post of posts || []) {
      const slug = post.slug || post.id;
      const gaViews = analyticsMap[slug] || 0;
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          view_count: gaViews,
          last_ga_sync: new Date().toISOString(),
        })
        .eq('id', post.id);

      if (!updateError) {
        updated++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Synced ${updated} posts`,
      timestamp: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error('Cron sync error:', err);
    return res.status(500).json({
      error: 'Failed to sync analytics',
      message: err?.message,
    });
  }
}