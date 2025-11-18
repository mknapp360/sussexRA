// src/pages/Near1066Meetings.tsx
import { useState, useEffect } from 'react'
import { MapPin, X, Clock, Phone } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import Calendar from '../components/Calendar'
import { supabase } from '../lib/supabase'
import type { ChapterMeeting } from '../types/chapter-meetings'
import SEO from '../components/SEO'

export default function NearBrightonMeetings() {
  const [meetings, setMeetings] = useState<ChapterMeeting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMeetings, setSelectedMeetings] = useState<ChapterMeeting[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadMeetings()
  }, [])

  async function loadMeetings() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('chapter_meetings')
        .select('*')
        .eq('published', true)
        .order('meeting_date', { ascending: true })

      if (error) throw error
      if (data) setMeetings(data as ChapterMeeting[])
    } catch (error) {
      console.error('Error loading meetings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (_date: Date, dayMeetings: ChapterMeeting[]) => {
    setSelectedMeetings(dayMeetings)
    setShowModal(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Town data with their chapters
  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title="Near 1066 Area Meetings - Sussex Royal Arch"
        description="View upcoming Royal Arch Chapter meetings in the Near 1066 area including Battle, Bexhill, Hastings, and surrounding towns."
      />

      {/* Header Image Section - Similar to Home.tsx */}
      <section 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/brightonTauFinal.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Calendar Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Upcoming Meetings Near Brighton
          </h2>
          
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">Loading calendar...</p>
              </CardContent>
            </Card>
          ) : (
            <Calendar
              meetings={meetings}
              onDateClick={handleDateClick}
              areaFilter="Brighton"
              className="shadow-lg"
            />
          )}
        </section>

        
      </div>

      {/* Meeting Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedMeetings.length > 0 && formatDate(selectedMeetings[0].meeting_date)}
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
  )
}