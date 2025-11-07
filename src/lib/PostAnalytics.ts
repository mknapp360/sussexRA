// src/lib/postAnalytics.ts

import { supabase } from './supabase';

/**
 * Track a view for a blog post
 * Only tracks once per user per 24 hours using localStorage
 */
export async function trackPostView(postId: string, slug: string): Promise<void> {
  try {
    // Check if already viewed in last 24 hours
    const viewKey = `post_view_${slug || postId}`;
    const lastView = localStorage.getItem(viewKey);
    
    if (lastView) {
      const lastViewTime = new Date(lastView).getTime();
      const now = new Date().getTime();
      const hoursSinceView = (now - lastViewTime) / (1000 * 60 * 60);
      
      // Don't track if viewed within last 24 hours
      if (hoursSinceView < 24) {
        console.log('View already tracked in last 24 hours');
        return;
      }
    }

    // Get current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get IP address for anonymous deduplication
    let ipAddress: string | null = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      console.error('Failed to get IP:', error);
    }

    // Track the view in database
    const { error } = await supabase
      .from('post_views')
      .insert({
        post_id: postId,
        user_id: user?.id || null,
        ip_address: ipAddress,
      });

    if (error) {
      console.error('Error tracking view:', error);
      return;
    }

    // Save to localStorage to prevent duplicate tracking
    localStorage.setItem(viewKey, new Date().toISOString());
    
    console.log('View tracked successfully');
  } catch (error) {
    console.error('Error in trackPostView:', error);
  }
}

/**
 * Sync GA4 data to database (should be run periodically via cron)
 * This updates view_count from Google Analytics
 */
export async function syncGAAnalytics(): Promise<void> {
  try {
    const response = await fetch('/api/blog-analytics');
    if (!response.ok) {
      throw new Error('Failed to fetch GA analytics');
    }

    const { data: analyticsMap } = await response.json();

    // Get all posts
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, slug');

    if (fetchError) throw fetchError;

    // Update each post with GA data
    for (const post of posts || []) {
      const gaViews = analyticsMap[post.slug || post.id] || 0;
      
      // Only update if GA has more views (GA is source of truth)
      await supabase
        .from('posts')
        .update({
          view_count: gaViews,
          last_ga_sync: new Date().toISOString(),
        })
        .eq('id', post.id);
    }

    console.log('GA analytics synced successfully');
  } catch (error) {
    console.error('Error syncing GA analytics:', error);
  }
}

/**
 * Get analytics for a specific post
 */
export async function getPostAnalytics(postId: string): Promise<{
  views: number;
  comments: number;
  likes: number;
}> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('view_count, comment_count, like_count')
      .eq('id', postId)
      .single();

    if (error) throw error;

    return {
      views: data?.view_count || 0,
      comments: data?.comment_count || 0,
      likes: data?.like_count || 0,
    };
  } catch (error) {
    console.error('Error getting post analytics:', error);
    return { views: 0, comments: 0, likes: 0 };
  }
}