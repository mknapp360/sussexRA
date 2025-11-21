// src/pages/AdminDashboard.tsx
// Enhanced with DigitalOcean-style design and AI referral tracking

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  fetchAnalyticsData,
  type AnalyticsData,
} from '../lib/googleAnalytics';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  Target,
  Bot,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-800 font-semibold text-lg">{error || 'Failed to load data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last 7 days vs. previous 7 days
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Sessions"
            value={analytics.sessions.value}
            change={analytics.sessions.percentageChange}
            previousValue={analytics.sessions.previousValue}
            icon={MousePointer}
            gradient="from-blue-500 to-cyan-500"
          />
          <MetricCard
            title="Page Views"
            value={analytics.pageviews.value}
            change={analytics.pageviews.percentageChange}
            previousValue={analytics.pageviews.previousValue}
            icon={Eye}
            gradient="from-purple-500 to-pink-500"
          />
          <MetricCard
            title="Unique Visitors"
            value={analytics.users.value}
            change={analytics.users.percentageChange}
            previousValue={analytics.users.previousValue}
            icon={Users}
            gradient="from-emerald-500 to-teal-500"
          />
          <MetricCard
            title="Avg. Duration"
            value={`${Math.floor(analytics.avgSessionDuration.value / 60)}:${String(analytics.avgSessionDuration.value % 60).padStart(2, '0')}`}
            change={analytics.avgSessionDuration.percentageChange}
            previousValue={`${Math.floor(analytics.avgSessionDuration.previousValue / 60)}:${String(analytics.avgSessionDuration.previousValue % 60).padStart(2, '0')}`}
            icon={Clock}
            gradient="from-orange-500 to-red-500"
            isTime
          />
        </div>

        {/* AI Referrals Section - NEW! */}
        {analytics.totalAISessions > 0 && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Discoveries
                </span>
                <span className="ml-auto text-sm font-normal text-slate-600">
                  {analytics.totalAISessions} sessions from AI assistants
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analytics.aiReferrals.map((ai) => (
                  <div
                    key={ai.source}
                    className="bg-white rounded-lg p-4 border border-indigo-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-slate-900 capitalize">
                        {ai.source}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Sessions:</span>
                        <span className="font-semibold text-slate-900">{ai.sessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Pages:</span>
                        <span className="font-semibold text-slate-900">{ai.pageviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Avg. Time:</span>
                        <span className="font-semibold text-slate-900">
                          {Math.floor(ai.avgDuration / 60)}:{String(ai.avgDuration % 60).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Traffic Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sessions Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Sessions Over Time
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Daily traffic patterns</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={analytics.sessions7Day}>
                  <defs>
                    <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#sessionsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pageviews Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Page Views Over Time
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Content engagement trends</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={analytics.pageviews7Day}>
                  <defs>
                    <linearGradient id="pageviewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#pageviewsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-slate-600" />
                Bounce Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-slate-900">
                  {analytics.bounceRate.value}%
                </span>
                <ChangeIndicator change={analytics.bounceRate.percentageChange} />
              </div>
              <p className="text-sm text-slate-500 mt-3">
                {analytics.bounceRate.previousValue}% previous period
              </p>
              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${100 - analytics.bounceRate.value}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Top Pages
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Most visited pages</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topPages.slice(0, 5).map((page, index) => {
                  const maxViews = analytics.topPages[0]?.views || 1;
                  const percentage = (page.views / maxViews) * 100;
                  
                  return (
                    <div key={page.page} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-slate-400 font-mono text-xs w-5">
                            #{index + 1}
                          </span>
                          <span className="text-slate-700 truncate font-medium">
                            {page.page === '/' ? 'Home' : page.page}
                          </span>
                        </div>
                        <span className="text-slate-900 font-semibold ml-2">
                          {page.views}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Enhanced Metric Card with Gradients
function MetricCard({
  title,
  value,
  change,
  previousValue,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: number | string;
  change: number;
  previousValue: number | string;
  icon: React.ElementType;
  gradient: string;
  isTime?: boolean;
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10`}>
          <Icon className={`w-4 h-4 bg-gradient-to-br ${gradient} bg-clip-text text-transparent`} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-end gap-3 mb-2">
          <span className="text-3xl font-bold text-slate-900">
            {value}
          </span>
          <ChangeIndicator change={change} />
        </div>
        <p className="text-xs text-slate-500">
          {previousValue} previous period
        </p>
      </CardContent>
    </Card>
  );
}

// Enhanced Change Indicator
function ChangeIndicator({ change }: { change: number }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  
  if (isNeutral) {
    return (
      <span className="flex items-center gap-1 text-sm font-medium text-slate-400">
        <span className="w-4 h-0.5 bg-slate-300" />
        0%
      </span>
    );
  }
  
  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
        isPositive 
          ? 'bg-emerald-50 text-emerald-700' 
          : 'bg-red-50 text-red-700'
      }`}>
        <Icon className="w-3 h-3" />
        {Math.abs(change)}%
      </div>
    </div>
  );
}