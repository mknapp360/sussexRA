// src/pages/Exaltations.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Calendar from '../components/Calendar';
import type { ChapterMeeting } from '../types/chapter-meetings';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { X, MapPin, Clock, Phone } from 'lucide-react';
import SEO from '../components/SEO';

export default function Exaltations() {
  const [meetings, setMeetings] = useState<ChapterMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeetings, setSelectedMeetings] = useState<ChapterMeeting[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadMeetings();
  }, []);

  async function loadMeetings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chapter_meetings')
        .select('*')
        .eq('published', true)
        .order('meeting_date', { ascending: true });

      if (error) throw error;

      if (data) {
        setMeetings(data as ChapterMeeting[]);
      }
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDateClick = (_date: Date, dayMeetings: ChapterMeeting[]) => {
    setSelectedMeetings(dayMeetings);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sussex Chapter Calendar - Royal Arch Exaltations"
        description="View upcoming Royal Arch Chapter meetings and exaltations across Sussex. Exaltations displayed in red, other Chapter meetings in blue."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-2">
            Sussex Chapter Calendar
          </h1>
          <p className="text-xl text-purple-100">
            Exaltations are displayed in red, other Chapter meetings in blue
          </p>
        </div>
      </section>

      {/* Notice Section */}
      <section className="py-6 px-4 bg-slate-50 border-b">
        <div className="container mx-auto max-w-6xl">
          <p className="text-center text-muted-foreground">
            If you are a Scribe E and don't see your exaltation listed here, make sure to{' '}
            <a href="/contact" className="text-blue-600 hover:underline font-medium">
              contact us
            </a>{' '}
            so we may add it.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading calendar...</p>
            </div>
          ) : (
            <Calendar
              meetings={meetings}
              onDateClick={handleDateClick}
              className="shadow-lg"
            />
          )}
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-lg font-semibold mb-4 text-center">Meeting Types</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Exaltation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm">Regular Meeting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm">Installation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span className="text-sm">Special Event</span>
            </div>
          </div>
        </div>
      </section>

      

      {/* Meeting Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">
                  {formatDate(selectedMeetings[0]?.meeting_date)}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {selectedMeetings.map(meeting => (
                  <div
                    key={meeting.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Meeting type badge */}
                    <div className="mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                          meeting.meeting_type === 'exaltation'
                            ? 'bg-red-500 text-white'
                            : meeting.meeting_type === 'installation'
                            ? 'bg-purple-500 text-white'
                            : meeting.meeting_type === 'special'
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {meeting.meeting_type.charAt(0).toUpperCase() + meeting.meeting_type.slice(1)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">
                      {meeting.chapter_name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Chapter No. {meeting.chapter_number}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <span>{meeting.meeting_time}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="font-medium">{meeting.location_name}</div>
                          <div className="text-muted-foreground">{meeting.address}</div>
                        </div>
                      </div>

                      {meeting.meeting_contact && (
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <span>{meeting.meeting_contact}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}