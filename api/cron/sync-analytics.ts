// api/cron/sync-analytics.ts
// Fixed version with correct environment variable names

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Starting GA4 sync...');

    // Get environment variables
    // Note: In Vercel API routes, use SUPABASE_URL not VITE_SUPABASE_URL
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
    const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL;
    const PRIVATE_KEY = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // Check credentials
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ 
        error: 'Missing Supabase credentials',
        has_url: !!SUPABASE_URL,
        has_service_key: !!SUPABASE_SERVICE_KEY,
        checked_vars: ['SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
      });
    }

    if (!PROPERTY_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Missing GA4 credentials',
        has_property: !!PROPERTY_ID,
        has_email: !!CLIENT_EMAIL,
        has_key: !!PRIVATE_KEY
      });
    }

    // Initialize GA4 client
    const gaClient = new BetaAnalyticsDataClient({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    });

    console.log('GA4 client initialized');

    // Get pageviews from GA4 (last 90 days)
    const [report] = await gaClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '2011-01-01', endDate: 'today' }],
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
        console.log(`Mapped: ${slug} = ${views} views`);
      }
    });

    console.log(`Analytics map has ${Object.keys(analyticsMap).length} slugs`);

    // Initialize Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get all posts
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug, title')
      .eq('published', true);

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${posts?.length || 0} posts in database`);

    // Update each post
    let updated = 0;
    const updates: any[] = [];
    
    for (const post of posts || []) {
      const slug = post.slug || post.id;
      const gaViews = analyticsMap[slug] || 0;
      
      console.log(`Updating "${post.title}" (${slug}): ${gaViews} views`);

      const { error: updateError, data: updateData } = await supabase
        .from('posts')
        .update({
          view_count: gaViews,
          last_ga_sync: new Date().toISOString(),
        })
        .eq('id', post.id)
        .select();

      if (updateError) {
        console.error(`Error updating ${slug}:`, updateError);
      } else {
        updated++;
        updates.push({
          title: post.title,
          slug,
          views: gaViews
        });
      }
    }

    console.log('Sync complete!');

    return res.status(200).json({
      success: true,
      message: `Synced ${updated} posts`,
      updated,
      total_posts: posts?.length || 0,
      analyticsMap,
      updates,
      timestamp: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error('Sync error:', err);
    return res.status(500).json({
      error: 'Failed to sync analytics',
      message: err?.message,
      stack: err?.stack,
    });
  }
}