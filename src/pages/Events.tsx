import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
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
}

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Placeholder data - replace with Supabase fetch later
  const PLACEHOLDER_EVENTS: Event[] = [
    {
      id: '1',
      slug: 'royal-arch-tracing-board-presentation',
      event_title: 'Royal Arch Tracing Board Presentation',
      event_date: 'Sat 22 Nov',
      event_time: '17:00 - 21:00',
      event_location_name: 'Horsham Masonic Hall',
      event_image: '/events/tracing-board.jpg',
      event_address: 'Denne Road, Horsham, West Sussex, RH12 1JF',
      event_info: 'Are you a recently exalted Companion? Never heard an explanation of the Royal Arch Tracing Boards? Then this is a meeting not to be missed!',
      rsvp_url: '#',
      rsvp_contact: null,
      published: true,
    },
    {
      id: '2',
      slug: 'chichester-chapter-improvement',
      event_title: 'Chichester Chapter of Improvement',
      event_date: 'Sat 29 Nov',
      event_time: '14:00 - 17:00',
      event_location_name: 'Chichester',
      event_image: '/events/chichester-chapter.jpg',
      event_address: 'Chichester, West Sussex',
      event_info: 'Did you miss out on hearing the three Royal Arch lectures being presented in your Chapter? Well, come along to North Sussex First Principals Chapter and listen to our members deliver, in sections, all three lectures.',
      rsvp_url: '#',
      rsvp_contact: null,
      published: true,
    },
    {
      id: '3',
      slug: 'annual-family-carol-service',
      event_title: 'Annual Family Carol Service',
      event_date: 'Sun 14 Dec',
      event_time: '14:30',
      event_location_name: 'Ardingly College Chapel',
      event_image: '/events/carol-service.jpg',
      event_address: 'Haywards Heath, RH17 6SQ',
      event_info: 'Family Carol Service - Everyone Welcome. Hosted by the Royal Arch on 14th December 2025 at 2:30pm.',
      rsvp_url: 'https://arco.de/bgNXro',
      rsvp_contact: 'pgs@sussexram.org.uk',
      published: true,
    },
  ];

  useEffect(() => {
    // Simulate loading - replace with actual Supabase call
    setTimeout(() => {
      setEvents(PLACEHOLDER_EVENTS);
      setLoading(false);
    }, 500);
  }, []);

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