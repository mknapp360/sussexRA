// api/ga4-debug.ts
// Shows ALL page paths that GA4 is tracking (no filters)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const PROPERTY_ID = process.env.GA4_PROPERTY_ID!;
    const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL!;
    const PRIVATE_KEY = process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, '\n');

    const client = new BetaAnalyticsDataClient({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    });

    // Get ALL pages (no filter) to see what paths GA4 actually has
    const [report] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      // NO FILTER - get everything
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 100, // Top 100 pages
    });

    const allPaths = (report.rows ?? []).map(row => ({
      path: row.dimensionValues?.[0]?.value ?? '',
      views: Number(row.metricValues?.[0]?.value ?? 0),
    }));

    // Filter to just blog-related paths
    const blogPaths = allPaths.filter(p => 
      p.path.includes('clearing') ||
      p.path.includes('divine') ||
      p.path.includes('spiritual') ||
      p.path.includes('post') ||
      p.path.includes('blog') ||
      p.path.includes('article')
    );

    return res.status(200).json({
      success: true,
      message: 'All page paths from GA4 (top 100)',
      all_paths: allPaths,
      blog_related_paths: blogPaths,
      total_rows: report.rows?.length || 0,
    });

  } catch (err: any) {
    return res.status(500).json({
      error: err?.message,
    });
  }
}