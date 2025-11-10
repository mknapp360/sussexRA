import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  description?: string;
  rsvpLink?: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Placeholder data - replace with Supabase fetch later
  const PLACEHOLDER_EVENTS: Event[] = [
    {
      id: '1',
      name: 'Royal Arch Tracing Board Presentation',
      date: 'Sat 22 Nov',
      location: 'Horsham Masonic Hall',
      image: '/events/tracing-board.jpg',
      description: 'Are you a recently exalted Companion? Never heard an explanation of the Royal Arch Tracing Boards? Then this is a meeting not to be missed!',
      rsvpLink: '#',
    },
    {
      id: '2',
      name: 'Chichester Chapter of Improvement',
      date: 'Sat 29 Nov',
      location: 'Chichester',
      image: '/events/chichester-chapter.jpg',
      description: 'Did you miss out on hearing the three Royal Arch lectures being presented in your Chapter? Well, come along to North Sussex First Principals Chapter and listen to our members deliver, in sections, all three lectures.',
      rsvpLink: '#',
    },
    {
      id: '3',
      name: 'Annual Family Carol Service',
      date: 'Sun 14 Dec',
      location: 'Ardingly College Chapel',
      image: '/events/carol-service.jpg',
      description: 'Family Carol Service - Everyone Welcome. Hosted by the Royal Arch on 14th December 2025 at 2:30pm.',
      rsvpLink: '#',
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
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Event Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={event.image}
                      alt={event.name}
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
                      {event.name}
                    </h2>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>

                    {/* Description (if available) */}
                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {event.description}
                      </p>
                    )}

                    {/* More Info Button - centered at bottom */}
                    <div className="flex justify-center mt-auto pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (event.rsvpLink) {
                            window.location.href = event.rsvpLink;
                          }
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