import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Edit, Trash, Eye, EyeOff, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface Event {
  id: string;
  slug: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location_name: string;
  event_address: string;
  event_info: string;
  event_image: string;
  rsvp_url: string | null;
  rsvp_contact: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading events',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (eventId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          published: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: currentStatus ? 'Event unpublished' : 'Event published',
        description: currentStatus 
          ? 'Event is now hidden from public' 
          : 'Event is now visible to public',
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: 'Error updating event',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteEventId) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', deleteEventId);

      if (error) throw error;

      toast({
        title: 'Event deleted',
        description: 'Event has been permanently deleted',
      });

      fetchEvents();
    } catch (error: any) {
      toast({
        title: 'Error deleting event',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeleteEventId(null);
    }
  };

  const getExcerpt = (html: string, maxLength = 120) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-40 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Events</h1>
              <p className="text-sm text-muted-foreground">
                Manage your events calendar
              </p>
            </div>
            <Button onClick={() => navigate('/admin/events/new')} className="gap-2">
              <Plus className="w-4 h-4" />
              New Event
            </Button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No events yet</p>
              <Button onClick={() => navigate('/admin/events/new')}>
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{event.event_title}</CardTitle>
                        {!event.published && (
                          <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                            Draft
                          </span>
                        )}
                      </div>
                      
                      {/* Event Details */}
                      <div className="space-y-1 mb-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3" />
                          {event.event_date} at {event.event_time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          📍 {event.event_location_name}
                        </p>
                      </div>

                      {/* Event Info Preview */}
                      <p className="text-sm text-muted-foreground mb-2">
                        {getExcerpt(event.event_info)}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Slug: /{event.slug}</span>
                        <span>Updated: {new Date(event.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublished(event.id, event.published)}
                        title={event.published ? 'Unpublish' : 'Publish'}
                      >
                        {event.published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteEventId(event.id)}
                        title="Delete"
                      >
                        <Trash className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}