// src/components/LocationSelector.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatLocationAddress } from '../types/locations';
import type { Location } from '../types/locations';
import { Button } from './ui/button';
import { MapPin, Plus, X } from 'lucide-react';

interface LocationSelectorProps {
  selectedLocationId: string | null;
  manualLocationName: string;
  manualAddress: string;
  onLocationSelect: (locationId: string | null) => void;
  onManualChange: (locationName: string, address: string) => void;
  required?: boolean;
}

export default function LocationSelector({
  selectedLocationId,
  manualLocationName,
  manualAddress,
  onLocationSelect,
  onManualChange,
  required = true,
}: LocationSelectorProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [useManual, setUseManual] = useState(!selectedLocationId);
  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    // If there's a selected location ID, switch to location mode
    if (selectedLocationId) {
      setUseManual(false);
    }
  }, [selectedLocationId]);

  async function loadLocations() {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('location_name');

      if (error) throw error;
      if (data) setLocations(data as Location[]);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    if (locationId) {
      onLocationSelect(locationId);
      // Auto-populate manual fields from selected location
      const location = locations.find(l => l.id === locationId);
      if (location) {
        onManualChange(location.location_name, formatLocationAddress(location));
      }
    } else {
      onLocationSelect(null);
    }
  };

  const switchToManual = () => {
    setUseManual(true);
    onLocationSelect(null);
  };

  const switchToLocation = () => {
    setUseManual(false);
    // Clear manual fields if switching back
    if (!selectedLocationId) {
      onManualChange('', '');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          type="button"
          size="sm"
          variant={!useManual ? 'default' : 'outline'}
          onClick={switchToLocation}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Select Location
        </Button>
        <span className="text-muted-foreground">or</span>
        <Button
          type="button"
          size="sm"
          variant={useManual ? 'default' : 'outline'}
          onClick={switchToManual}
        >
          Enter Manually
        </Button>
      </div>

      {!useManual ? (
        // Location Selection Mode
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Location {required && '*'}
            </label>
            <select
              value={selectedLocationId || ''}
              onChange={handleLocationChange}
              required={required && !useManual}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">-- Select a location --</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.location_name} - {location.location_city}
                </option>
              ))}
            </select>
          </div>

          {/* Show selected location details */}
          {selectedLocationId && (
            <div className="p-3 bg-slate-50 rounded-md border text-sm">
              {(() => {
                const location = locations.find(l => l.id === selectedLocationId);
                if (!location) return null;
                return (
                  <div>
                    <p className="font-medium">{location.location_name}</p>
                    <p className="text-muted-foreground mt-1">
                      {formatLocationAddress(location)}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Link to add new location */}
          <div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowAddNew(!showAddNew)}
              className="text-purple-600 hover:text-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Don't see your location? Add it to the database
            </Button>
          </div>

          {showAddNew && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-blue-900">Add New Location</p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddNew(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-blue-800">
                To add a new location to the database, please go to{' '}
                <a
                  href="/admin/locations"
                  target="_blank"
                  className="underline font-medium"
                >
                  Locations Management
                </a>
                . Once added, refresh this page to use it.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Or switch to "Enter Manually" for a one-time location.
              </p>
            </div>
          )}
        </div>
      ) : (
        // Manual Entry Mode
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Location Name {required && '*'}
            </label>
            <input
              type="text"
              value={manualLocationName}
              onChange={(e) => onManualChange(e.target.value, manualAddress)}
              required={required && useManual}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., St Leonards Masonic Hall"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Full Address {required && '*'}
            </label>
            <textarea
              value={manualAddress}
              onChange={(e) => onManualChange(manualLocationName, e.target.value)}
              required={required && useManual}
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Full street address including postcode"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-md border border-amber-200 text-sm text-amber-900">
            <strong>Note:</strong> This is a one-time manual entry. If you use this location 
            frequently, consider adding it to the{' '}
            <a href="/admin/locations" target="_blank" className="underline">
              Locations database
            </a>.
          </div>
        </div>
      )}
    </div>
  );
}