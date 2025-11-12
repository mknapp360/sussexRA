import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

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
}

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents((data as Event[]) || []);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Events — Sussex Royal Arch Masonry"
        description="Upcoming events and meetings for Sussex Royal Arch Masonry members and guests."
      />

      {/* Header Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Upcoming & Recent Events
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Join us for upcoming meetings, presentations, and special events throughout the year.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events scheduled at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
                  onClick={() => navigate(`/events/${event.slug}`)}
                >
                  {/* Event Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={event.event_image}
                      alt={event.event_title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback for missing images
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18"%3EEvent Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Event Content */}
                  <CardContent className="flex flex-col flex-1 p-6">
                    {/* Event Name */}
                    <h2 className="text-xl font-bold mb-3 text-foreground">
                      {event.event_title}
                    </h2>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.event_date}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{event.event_location_name}</span>
                    </div>

                    {/* Description (if available) */}
                    {event.event_info && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {event.event_info.replace(/<[^>]*>/g, '')}
                      </p>
                    )}

                    {/* More Info Button - centered at bottom */}
                    <div className="flex justify-center mt-auto pt-4">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event.slug}`);
                        }}
                        className="w-full max-w-[200px]"
                      >
                        More Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Stay Updated?</h2>
          <p className="text-muted-foreground mb-6">
            Join our mailing list to receive notifications about upcoming events and meetings.
          </p>
          <Button size="lg" variant="default">
            Subscribe to Updates
          </Button>
        </div>
      </section>
    </div>
  );
}