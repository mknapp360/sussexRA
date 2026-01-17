// src/types/events.ts
// TypeScript interfaces for the Events system

/**
 * Complete Event interface matching the database schema
 */
export interface Event {
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
  featured: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Event preview interface for the listing page
 * Use this when you only need basic info
 */
export interface EventPreview {
  id: string;
  slug: string;
  event_title: string;
  event_date: string;
  event_location_name: string;
  event_image: string;
  event_info: string;
  published: boolean;
  featured: boolean;
}

/**
 * Event form data for creating/editing events
 * Excludes auto-generated fields like id and timestamps
 */
export interface EventFormData {
  slug: string;
  event_title: string;
  event_date: string;
  event_time: string;
  event_location_name: string;
  event_image?: string;
  event_address: string;
  event_info: string;
  rsvp_url?: string;
  rsvp_contact?: string;
  published?: boolean;
  featured?: boolean;
}

/**
 * Supabase query result type
 */
export type EventsQueryResult = {
  data: Event[] | null;
  error: Error | null;
};

/**
 * Example usage in components:
 * 
 * import { Event, EventPreview } from '../types/events';
 * 
 * const [events, setEvents] = useState<Event[]>([]);
 * const [event, setEvent] = useState<Event | null>(null);
 * 
 * async function loadEvents() {
 *   const { data, error } = await supabase
 *     .from('events')
 *     .select('*')
 *     .eq('published', true);
 *   
 *   if (data) setEvents(data as Event[]);
 * }
 */