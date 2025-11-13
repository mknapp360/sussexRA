// src/types/locations.ts
// TypeScript interfaces for the Locations system

/**
 * Location/Venue interface matching the database schema
 */
export interface Location {
  id: string;
  location_name: string;
  location_street: string;
  location_street_2: string | null;
  location_city: string;
  location_post_code: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Location with computed full address
 */
export interface LocationWithAddress extends Location {
  full_address: string;
}

/**
 * Form data for creating/editing locations
 */
export interface LocationFormData {
  location_name: string;
  location_street: string;
  location_street_2?: string;
  location_city: string;
  location_post_code: string;
}

/**
 * Helper function to format location as full address string
 */
export function formatLocationAddress(location: Location): string {
  const parts = [
    location.location_street,
    location.location_street_2,
    location.location_city,
    location.location_post_code,
  ].filter(part => part && part.trim() !== '');
  
  return parts.join(', ');
}

/**
 * Helper function to format location as multi-line address
 */
export function formatLocationAddressMultiline(location: Location): string {
  const lines = [
    location.location_street,
    location.location_street_2,
    location.location_city,
    location.location_post_code,
  ].filter(part => part && part.trim() !== '');
  
  return lines.join('\n');
}