// api/cron/sync-analytics.ts
// Version without auth check for testing

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Starting GA4 sync...');

    const PROPERTY_ID = process.env.GA4_PROPERTY_ID!;
    const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL!;
    const PRIVATE_KEY = process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, '\n');
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!PROPERTY_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return res.status(500).json({ error: 'Missing GA4 credentials' });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Missing Supabase credentials' });
    }

    // Initialize GA4 client
    const gaClient = new BetaAnalyticsDataClient({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    });

    // Get pageviews from GA4 (last 90 days)
    const [report] = await gaClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'CONTAINS',
            value: '/post/',
          },
        },
      },
      limit: 1000,
    });

    console.log(`GA4 returned ${report.rows?.length || 0} rows`);

    // Build analytics map
    const analyticsMap: Record<string, number> = {};
    (report.rows ?? []).forEach(row => {
      const pagePath = row.dimensionValues?.[0]?.value ?? '';
      const views = Number(row.metricValues?.[0]?.value ?? 0);
      
      const match = pagePath.match(/\/post\/([^/?]+)/);
      if (match && match[1]) {
        const slug = match[1];
        analyticsMap[slug] = (analyticsMap[slug] || 0) + views;
      }
    });

    console.log('Analytics map:', analyticsMap);

    // Initialize Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get all posts
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug, title')
      .eq('published', true);

    if (fetchError) throw fetchError;

    console.log(`Found ${posts?.length || 0} posts in database`);

    // Update each post
    let updated = 0;
    for (const post of posts || []) {
      const slug = post.slug || post.id;
      const gaViews = analyticsMap[slug] || 0;
      
      console.log(`Updating ${slug}: ${gaViews} views`);

      const { error: updateError } = await supabase
        .from('posts')
        .update({
          view_count: gaViews,
          last_ga_sync: new Date().toISOString(),
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Error updating ${slug}:`, updateError);
      } else {
        updated++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Synced ${updated} posts`,
      updated,
      analyticsMap,
      timestamp: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error('Sync error:', err);
    return res.status(500).json({
      error: 'Failed to sync analytics',
      message: err?.message,
    });
  }
}