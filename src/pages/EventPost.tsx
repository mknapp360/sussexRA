import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { ArrowLeft, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import SEO from '../components/SEO';

interface Event {
  id: string;
  slug: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location_name: string;
  event_image: string;
  event_address: string;
  event_info: string;
  rsvp_url: string | null;
  rsvp_contact: string | null;
  published: boolean;
  created_at: string;
}

export default function EventPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [slug]);

  async function loadEvent() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        // Fallback to searching by ID if slug doesn't work
        const { data: dataById } = await supabase
          .from('events')
          .select('*')
          .eq('id', slug)
          .eq('published', true)
          .single();
        setEvent(dataById as Event);
      } else {
        setEvent(data as Event);
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-4xl font-bold">Event Not Found</h1>
        <p className="text-muted-foreground text-center">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/events')}>Back to Events</Button>
      </div>
    );
  }

  // Prepare share URL
  const shareUrl = window.location.href;
  const shareText = encodeURIComponent(`Check out this event: ${event.event_title}`);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${event.event_title} — Sussex Royal Arch Masonry`}
        description={event.event_info.substring(0, 160)}
      />

      {/* Header with Back Button */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/events')}
            className="mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Event Content */}
      <article className="max-w-2xl mx-auto px-4 py-12">
        {/* Event Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            {event.event_title}
          </h1>

          {/* Date and Location */}
          <p className="text-lg text-muted-foreground mb-2">
            {event.event_date} | {event.event_location_name}
          </p>
        </div>

        {/* Event Info Text - Above Image */}
        <div 
          className="prose prose-slate max-w-none mb-8 text-center"
          dangerouslySetInnerHTML={{ __html: event.event_info }}
        />

        {/* RSVP Button - Centered Above Image */}
        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12"
            onClick={() => {
              if (event.rsvp_url) {
                window.open(event.rsvp_url, '_blank');
              }
            }}
          >
            RSVP
          </Button>
        </div>

        {/* Event Image - Below Info */}
        {event.event_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={event.event_image}
              alt={event.event_title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Time & Location Section */}
        <div className="bg-slate-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Time & Location</h2>
          
          <div className="space-y-3 mb-6">
            <p className="text-foreground">
              {event.event_date}, {event.event_time}
            </p>
            <p className="text-foreground font-medium">
              {event.event_location_name}
            </p>
            <p className="text-muted-foreground">
              {event.event_address}
            </p>
          </div>

          {/* RSVP Button in Box */}
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-12"
            onClick={() => {
              if (event.rsvp_url) {
                window.open(event.rsvp_url, '_blank');
              }
            }}
          >
            RSVP
          </Button>
        </div>

        {/* Map Placeholder */}
        <div className="bg-slate-100 rounded-lg p-8 mb-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Map Integration</p>
            <p className="text-sm text-muted-foreground">
              {event.event_address}
            </p>
          </div>
        </div>

        {/* Share Section */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share this event
          </h3>

          <div className="flex gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Contact for RSVP (if no URL) */}
        {!event.rsvp_url && event.rsvp_contact && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              To RSVP for this event, please contact:
            </p>
            <p className="text-blue-700">{event.rsvp_contact}</p>
          </div>
        )}
      </article>

      {/* Back to Events */}
      <div className="container mx-auto px-4 pb-12">
        <div className="text-center">
          <Button
            onClick={() => navigate('/events')}
            variant="ghost"
            className="gap-2"
          >
            ← Back to All Events
          </Button>
        </div>
      </div>
    </div>
  );
}