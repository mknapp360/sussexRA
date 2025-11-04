import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  fetchAnalyticsData,
  formatPercentageChange,
  formatDuration,
  type AnalyticsData,
} from '../lib/googleAnalytics';
import { TrendingUp, TrendingDown, Users, Eye, MousePointer } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const data = await fetchAnalyticsData();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
    // Refresh every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">{error || 'Failed to load data'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-30 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Last 30 days vs. previous 30 days
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                1 visitor in the last 30 minutes
              </p>
              <button className="text-sm text-primary hover:underline mt-1">
                View Your Site Analytics →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Site sessions"
            value={analytics.sessions.value}
            change={analytics.sessions.percentageChange}
            previousValue={analytics.sessions.previousValue}
            icon={MousePointer}
          />
          <StatCard
            title="Page views"
            value={analytics.pageviews.value}
            change={analytics.pageviews.percentageChange}
            previousValue={analytics.pageviews.previousValue}
            icon={Eye}
          />
          <StatCard
            title="Unique visitors"
            value={analytics.users.value}
            change={analytics.users.percentageChange}
            previousValue={analytics.users.previousValue}
            icon={Users}
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Bounce Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{analytics.bounceRate.value}%</span>
                <ChangeIndicator change={analytics.bounceRate.percentageChange} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {analytics.bounceRate.previousValue}% previous period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Avg. Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">
                  {formatDuration(analytics.avgSessionDuration.value)}
                </span>
                <ChangeIndicator change={analytics.avgSessionDuration.percentageChange} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {formatDuration(analytics.avgSessionDuration.previousValue)} previous period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Sessions (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <MiniChart data={analytics.sessions7Day} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Page Views (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <MiniChart data={analytics.pageviews7Day} />
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-muted-foreground font-mono text-sm w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm truncate">{page.page}</span>
                  </div>
                  <span className="text-sm font-medium">{page.views} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  change,
  previousValue,
  icon: Icon,
}: {
  title: string;
  value: number;
  change: number;
  previousValue: number;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">{value}</span>
          <ChangeIndicator change={change} />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {previousValue} previous period
        </p>
      </CardContent>
    </Card>
  );
}

// Change Indicator Component
function ChangeIndicator({ change }: { change: number }) {
  const isPositive = change > 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${colorClass}`}>
      <Icon className="w-4 h-4" />
      {formatPercentageChange(change)}
    </span>
  );
}

// Mini Chart Component (Simple bar chart)
function MiniChart({ data }: { data: { date: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const percentage = (item.value / maxValue) * 100;
        const date = new Date(item.date);
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

        return (
          <div key={item.date} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{dayLabel}</span>
              <span className="font-medium">{item.value}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}