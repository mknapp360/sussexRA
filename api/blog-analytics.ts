// api/blog-analytics.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface PostAnalytics {
  slug: string;
  views: number;
  // Note: GA4 doesn't track comments/likes - those need to be in your database
  // But we can get engagement metrics like avgEngagementTime
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const PROPERTY_ID = process.env.GA4_PROPERTY_ID!;
    const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL!;
    const PRIVATE_KEY = process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, '\n');

    if (!PROPERTY_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return res.status(500).json({ error: 'Missing GA4 credentials' });
    }

    const client = new BetaAnalyticsDataClient({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    });

    // Get pageviews per blog post (last 30 days)
    const [report] = await client.runReport({
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
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 100, // Get top 100 posts
    });

    // Transform the data into a map of slug -> views
    const analyticsMap: Record<string, number> = {};
    
    (report.rows ?? []).forEach(row => {
      const pagePath = row.dimensionValues?.[0]?.value ?? '';
      const views = Number(row.metricValues?.[0]?.value ?? 0);
      
      // Extract slug from path (e.g., "/blog/my-post" -> "my-post")
      const match = pagePath.match(/\/blog\/([^/?]+)/);
      if (match && match[1]) {
        const slug = match[1];
        // If same slug appears multiple times (different query params), sum them
        analyticsMap[slug] = (analyticsMap[slug] || 0) + views;
      }
    });

    // Return the analytics data
    return res.status(200).json({
      success: true,
      data: analyticsMap,
      timestamp: new Date().toISOString(),
    });

  } catch (err: any) {
    console.error('Blog Analytics API error:', err);
    return res.status(500).json({
      error: 'Failed to fetch blog analytics',
      message: err?.message,
    });
  }
}