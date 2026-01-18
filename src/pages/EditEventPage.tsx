import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, Save, Eye, Trash2, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
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

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [eventTitle, setEventTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [originalSlug, setOriginalSlug] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocationName, setEventLocationName] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [eventInfo, setEventInfo] = useState('');
  const [rsvpUrl, setRsvpUrl] = useState('');
  const [rsvpContact, setRsvpContact] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setEventTitle(data.event_title);
      setSlug(data.slug);
      setOriginalSlug(data.slug);
      setEventDate(data.event_date);
      setEventTime(data.event_time);
      setEventLocationName(data.event_location_name);
      setEventAddress(data.event_address);
      setEventImage(data.event_image || '');
      setEventInfo(data.event_info);
      setRsvpUrl(data.rsvp_url || '');
      setRsvpContact(data.rsvp_contact || '');
      setPublished(data.published);
      setFeatured(data.featured || false);

      // Try to parse the date if it's in a recognizable format
      try {
        const parsedDate = new Date(data.event_date);
        if (!isNaN(parsedDate.getTime())) {
          setSelectedDate(parsedDate);
        }
      } catch (e) {
        // If parsing fails, just keep the string
      }

    } catch (error: any) {
      console.error('Error loading event:', error);
      toast({
        title: 'Error loading event',
        description: error.message,
        variant: 'destructive',
      });
      navigate('/admin/events');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (newTitle: string) => {
    setEventTitle(newTitle);
    // Auto-generate slug if it's empty or matches the old title's slug
    if (!slug || slug === generateSlug(eventTitle)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSave = async () => {
    // Validation
    if (!eventTitle.trim()) {
      toast({
        title: 'Title required',
        description: 'Please add a title to your event',
        variant: 'destructive',
      });
      return;
    }

    if (!slug.trim()) {
      toast({
        title: 'Slug required',
        description: 'Please add a URL slug for your event',
        variant: 'destructive',
      });
      return;
    }

    if (!eventDate.trim()) {
      toast({
        title: 'Date required',
        description: 'Please add an event date',
        variant: 'destructive',
      });
      return;
    }

    if (!eventTime.trim()) {
      toast({
        title: 'Time required',
        description: 'Please add an event time',
        variant: 'destructive',
      });
      return;
    }

    if (!eventLocationName.trim()) {
      toast({
        title: 'Location required',
        description: 'Please add a location name',
        variant: 'destructive',
      });
      return;
    }

    if (!eventAddress.trim()) {
      toast({
        title: 'Address required',
        description: 'Please add an event address',
        variant: 'destructive',
      });
      return;
    }

    if (!eventInfo.trim()) {
      toast({
        title: 'Event info required',
        description: 'Please add event information',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      // Check if slug changed and if new slug already exists
      if (slug !== originalSlug) {
        const { data: existingEvent } = await supabase
          .from('events')
          .select('slug')
          .eq('slug', slug)
          .single();

        if (existingEvent) {
          toast({
            title: 'Slug already exists',
            description: 'Please use a different URL slug',
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
      }

      const updateData = {
        slug,
        event_title: eventTitle,
        event_date: eventDate,
        event_time: eventTime,
        event_location_name: eventLocationName,
        event_address: eventAddress,
        event_image: eventImage || null,
        event_info: eventInfo,
        rsvp_url: rsvpUrl || null,
        rsvp_contact: rsvpContact || null,
        featured: featured,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Event updated!',
        description: 'Your changes have been saved',
      });

      setOriginalSlug(slug);

    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: 'Failed to save',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    setSaving(true);

    try {
      const newPublishedState = !published;
      
      const { error } = await supabase
        .from('events')
        .update({ 
          published: newPublishedState,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      setPublished(newPublishedState);
      
      toast({
        title: newPublishedState ? 'Event published!' : 'Event unpublished',
        description: newPublishedState 
          ? 'Your event is now visible to the public' 
          : 'Your event is now hidden from the public',
      });

    } catch (error: any) {
      console.error('Error toggling publish:', error);
      toast({
        title: 'Failed to update',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Event deleted',
        description: 'Event has been permanently deleted',
      });

      navigate('/admin/events');

    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Failed to delete',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading event...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-40 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/events')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Edit Event</h1>
                <p className="text-sm text-muted-foreground">Make changes to your event</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
              
              <Button
                variant={published ? 'outline' : 'default'}
                onClick={handlePublishToggle}
                disabled={saving}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                {published ? 'Unpublish' : 'Publish'}
              </Button>
              
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Event Details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="event-title">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-title"
                placeholder="Royal Arch Tracing Board Presentation"
                value={eventTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                placeholder="royal-arch-tracing-board-presentation"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your event will be at: /events/{slug || 'your-slug'}
              </p>
            </div>

            {/* Date and Time - Side by Side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event-date">
                  Event Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>{eventDate || 'Pick a date'}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) {
                          setEventDate(format(date, 'EEEE do MMMM yyyy'));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Select a date from the calendar
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-time">
                  Event Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="event-time"
                  placeholder="17:00 - 21:00"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Example: "17:00 - 21:00" or "2:30pm"
                </p>
              </div>
            </div>

            {/* Location Name and Address */}
            <div className="space-y-2">
              <Label htmlFor="location-name">
                Location Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location-name"
                placeholder="Horsham Masonic Hall"
                value={eventLocationName}
                onChange={(e) => setEventLocationName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-address">
                Full Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="event-address"
                placeholder="Denne Road, Horsham, West Sussex, RH12 1JF"
                value={eventAddress}
                onChange={(e) => setEventAddress(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This will be used for the map and location details
              </p>
            </div>

            {/* Event Image */}
            <div className="space-y-2">
              <Label htmlFor="event-image">Event Image URL</Label>
              <Input
                id="event-image"
                type="url"
                placeholder="https://example.com/event-image.jpg or /events/my-event.jpg"
                value={eventImage}
                onChange={(e) => setEventImage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Upload image to /public/events/ folder and reference as: /events/image-name.jpg
              </p>
            </div>

            {/* Event Info */}
            <div className="space-y-2">
              <Label htmlFor="event-info">
                Event Information <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="event-info"
                placeholder="Add event description here. You can use HTML tags like <p>, <strong>, <ul>, etc."
                value={eventInfo}
                onChange={(e) => setEventInfo(e.target.value)}
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                HTML formatting is supported. This will appear on the event detail page.
              </p>
            </div>

            {/* RSVP Options */}
            <div className="border-t pt-6">
              <h3 className="text-base font-semibold mb-4">RSVP Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Provide either an RSVP URL or contact information (or both)
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rsvp-url">RSVP Link</Label>
                  <Input
                    id="rsvp-url"
                    type="url"
                    placeholder="https://example.com/rsvp or https://arco.de/bgNXro"
                    value={rsvpUrl}
                    onChange={(e) => setRsvpUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    External link for RSVP (e.g., Google Forms, Eventbrite)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rsvp-contact">RSVP Contact</Label>
                  <Input
                    id="rsvp-contact"
                    placeholder="email@example.com or phone number"
                    value={rsvpContact}
                    onChange={(e) => setRsvpContact(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Email or phone for RSVP (displayed if no URL is provided)
                  </p>
                </div>
              </div>
            </div>
            <p>Tick box if it is a featured event</p>
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300"
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
