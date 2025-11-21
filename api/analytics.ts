// api/analytics.ts
// Enhanced version with AI referral tracking
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

type AnalyticsMetric = { 
  value: number; 
  previousValue: number; 
  percentageChange: number; 
};

type AIReferral = {
  source: string;
  sessions: number;
  pageviews: number;
  avgDuration: number;
};

type AnalyticsData = {
  sessions: AnalyticsMetric;
  pageviews: AnalyticsMetric;
  users: AnalyticsMetric;
  bounceRate: AnalyticsMetric;
  avgSessionDuration: AnalyticsMetric;
  sessions7Day: { date: string; value: number }[];
  pageviews7Day: { date: string; value: number }[];
  topPages: { page: string; views: number }[];
  aiReferrals: AIReferral[];
  totalAISessions: number;
};

function pctChange(curr: number, prev: number): number {
  if (!prev) return curr ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
    const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL;
    const PRIVATE_KEY = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!PROPERTY_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Missing GA4 credentials',
        debug: {
          hasPropertyId: !!PROPERTY_ID,
          hasEmail: !!CLIENT_EMAIL,
          hasKey: !!PRIVATE_KEY
        }
      });
    }

    const client = new BetaAnalyticsDataClient({
      credentials: { 
        client_email: CLIENT_EMAIL, 
        private_key: PRIVATE_KEY 
      },
    });

    const num = (arr: any[], i: number) => Number(arr[i]?.value ?? 0);

    // 1) Core metrics
    const [totals] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        { startDate: '7daysAgo', endDate: 'today', name: 'current' },
        { startDate: '14daysAgo', endDate: '7daysAgo', name: 'previous' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
      ],
    });

    const curr = totals.rows?.[0]?.metricValues ?? [];
    const prev = totals.rows?.[1]?.metricValues ?? [];

    const mSessions = { current: num(curr, 0), previous: num(prev, 0) };
    const mViews = { current: num(curr, 1), previous: num(prev, 1) };
    const mUsers = { current: num(curr, 2), previous: num(prev, 2) };

    // 2) Sessions time series
    const [seriesSessions] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });
    
    const sessions7Day = (seriesSessions.rows ?? []).map(r => {
      const d = r.dimensionValues?.[0]?.value ?? '';
      const iso = d ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : '';
      return { date: iso, value: Number(r.metricValues?.[0]?.value ?? 0) };
    });

    // 3) Pageviews time series
    const [seriesViews] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });
    
    const pageviews7Day = (seriesViews.rows ?? []).map(r => {
      const d = r.dimensionValues?.[0]?.value ?? '';
      const iso = d ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : '';
      return { date: iso, value: Number(r.metricValues?.[0]?.value ?? 0) };
    });

    // 4) Top pages
    const [top] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });
    
    const topPages = (top.rows ?? []).map(r => ({
      page: r.dimensionValues?.[0]?.value ?? '',
      views: Number(r.metricValues?.[0]?.value ?? 0),
    }));

    // 5) Bounce rate
    let bounceRate = { value: 0, previousValue: 0, percentageChange: 0 };
    try {
      const [br] = await client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [
          { startDate: '7daysAgo', endDate: 'today', name: 'current' },
          { startDate: '14daysAgo', endDate: '7daysAgo', name: 'previous' },
        ],
        metrics: [{ name: 'bounceRate' }],
      });
      const c = Number(br.rows?.[0]?.metricValues?.[0]?.value ?? 0);
      const p = Number(br.rows?.[1]?.metricValues?.[0]?.value ?? 0);
      bounceRate = { 
        value: Math.round(c), 
        previousValue: Math.round(p), 
        percentageChange: pctChange(c, p) 
      };
    } catch (error) {
      console.error('Error fetching bounce rate:', error);
    }

    // 6) Average session duration
    let avgSessionDuration = { value: 0, previousValue: 0, percentageChange: 0 };
    try {
      const [asd] = await client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [
          { startDate: '7daysAgo', endDate: 'today', name: 'current' },
          { startDate: '14daysAgo', endDate: '7daysAgo', name: 'previous' },
        ],
        metrics: [{ name: 'averageSessionDuration' }],
      });
      const c = Number(asd.rows?.[0]?.metricValues?.[0]?.value ?? 0);
      const p = Number(asd.rows?.[1]?.metricValues?.[0]?.value ?? 0);
      avgSessionDuration = { 
        value: Math.round(c), 
        previousValue: Math.round(p), 
        percentageChange: pctChange(c, p) 
      };
    } catch (error) {
      console.error('Error fetching session duration:', error);
    }

    // 7) AI REFERRAL TRACKING - NEW!
    let aiReferrals: AIReferral[] = [];
    let totalAISessions = 0;
    
    try {
      const [aiTraffic] = await client.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' }
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'sessionMedium',
            stringFilter: {
              matchType: 'EXACT',
              value: 'ai'
            }
          }
        },
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      });

      aiReferrals = (aiTraffic.rows ?? []).map(r => {
        const sessions = Number(r.metricValues?.[0]?.value ?? 0);
        totalAISessions += sessions;
        
        return {
          source: r.dimensionValues?.[0]?.value ?? '',
          sessions,
          pageviews: Number(r.metricValues?.[1]?.value ?? 0),
          avgDuration: Math.round(Number(r.metricValues?.[2]?.value ?? 0)),
        };
      });
    } catch (error) {
      console.error('Error fetching AI referrals:', error);
    }

    const data: AnalyticsData = {
      sessions: { 
        value: mSessions.current, 
        previousValue: mSessions.previous, 
        percentageChange: pctChange(mSessions.current, mSessions.previous) 
      },
      pageviews: { 
        value: mViews.current, 
        previousValue: mViews.previous, 
        percentageChange: pctChange(mViews.current, mViews.previous) 
      },
      users: { 
        value: mUsers.current, 
        previousValue: mUsers.previous, 
        percentageChange: pctChange(mUsers.current, mUsers.previous) 
      },
      bounceRate,
      avgSessionDuration,
      sessions7Day,
      pageviews7Day,
      topPages,
      aiReferrals,
      totalAISessions,
    };

    return res.status(200).json(data);

  } catch (err: any) {
    console.error('GA4 API error:', {
      message: err?.message,
      code: err?.code,
      name: err?.name,
      details: err?.details,
      stack: err?.stack
    });
    
    return res.status(500).json({
      error: 'Failed to fetch analytics',
      debug: {
        message: err?.message,
        code: err?.code,
        name: err?.name
      }
    });
  }
}