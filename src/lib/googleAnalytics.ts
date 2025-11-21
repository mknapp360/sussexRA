// src/lib/googleAnalytics.ts
// Updated with AI referral tracking types

export interface AnalyticsMetric {
  value: number;
  previousValue: number;
  percentageChange: number;
}

export interface AIReferral {
  source: string;
  sessions: number;
  pageviews: number;
  avgDuration: number;
}

export interface AnalyticsData {
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
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  const res = await fetch('/api/analytics', { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatPercentageChange(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}%`;
}