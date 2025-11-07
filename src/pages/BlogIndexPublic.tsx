import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, ArrowRight, Heart, Eye } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug?: string;
  published: boolean;
  published_at: string;
  created_at: string;
  cover_image?: string;
  view_count: number;
  like_count: number;
}

const PAGE_SIZE = 9;

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset posts when component mounts
    setPosts([]);
    setPage(0);
    setHasMore(true);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = async () => {
    // Prevent duplicate calls
    if (loading) return;
    
    setLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, excerpt, slug, published_at, created_at, cover_image, view_count, like_count')
        .eq('published', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        // Deduplicate posts by ID
        setPosts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPosts = (data as Post[]).filter(p => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
        
        if (data.length < PAGE_SIZE) setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExcerpt = (post: Post) => {
    if (post.excerpt) return post.excerpt;
    
    // Extract text from HTML content
    const text = post.content.replace(/<[^>]*>/g, '');
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  };

  const getPostUrl = (post: Post) => {
    return `/blog/${post.slug || post.id}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-4">
              Blog & Teachings
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore insights on Kabbalah, Tarot, angelic correspondences, and the path of spiritual sovereignty
            </p>
          </div>
        </div>
      </header>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 py-12">
        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts published yet. Check back soon!</p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(getPostUrl(post))}
            >
              {/* Cover Image */}
              {post.cover_image && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <CardContent className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-3 text-headerText group-hover:text-yellow-600 transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {getExcerpt(post)}
                </p>

                {/* Analytics bar - ADD THIS ENTIRE SECTION */}
                <div className="flex items-center gap-4 pt-4 mt-4 border-t border-border">
                  {/* Views */}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.view_count || 0}</span>
                  </div>

                  {/* Likes */}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">{post.like_count || 0}</span>
                  </div>
                </div>

                {/* Read More Link */}
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              {loading ? 'Loading...' : 'Load More Posts'}
            </Button>
          </div>
        )}
      </section>

      {/* Back to Home */}
      <div className="container mx-auto px-4 pb-12">
        <div className="text-center">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="gap-2"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}