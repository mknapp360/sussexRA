// src/pages/AdminLocations.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { formatLocationAddress } from '../types/locations';
import type { Location } from '../types/locations';

export default function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    location_name: '',
    location_street: '',
    location_street_2: '',
    location_city: '',
    location_post_code: '',
  });

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    setLoading(true);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Update existing location
        const { error } = await supabase
          .from('locations')
          .update({
            location_name: formData.location_name,
            location_street: formData.location_street,
            location_street_2: formData.location_street_2 || null,
            location_city: formData.location_city,
            location_post_code: formData.location_post_code,
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create new location
        const { error } = await supabase
          .from('locations')
          .insert([{
            location_name: formData.location_name,
            location_street: formData.location_street,
            location_street_2: formData.location_street_2 || null,
            location_city: formData.location_city,
            location_post_code: formData.location_post_code,
          }]);

        if (error) throw error;
      }

      // Reset form and reload
      resetForm();
      loadLocations();
    } catch (error: any) {
      console.error('Error saving location:', error);
      if (error.code === '23505') {
        alert('A location with this name already exists');
      } else {
        alert('Failed to save location');
      }
    }
  }

  function resetForm() {
    setFormData({
      location_name: '',
      location_street: '',
      location_street_2: '',
      location_city: '',
      location_post_code: '',
    });
    setEditingId(null);
    setShowForm(false);
  }

  function editLocation(location: Location) {
    setFormData({
      location_name: location.location_name,
      location_street: location.location_street,
      location_street_2: location.location_street_2 || '',
      location_city: location.location_city,
      location_post_code: location.location_post_code,
    });
    setEditingId(location.id);
    setShowForm(true);
  }

  async function deleteLocation(id: string) {
    if (!confirm('Are you sure you want to delete this location? Any meetings using it will need manual addresses.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLocations(locations.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location');
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading locations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-30 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
              <p className="text-muted-foreground mt-1">
                Manage venue addresses for meetings and events
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? 'Edit Location' : 'Add New Location'}
                </h2>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    name="location_name"
                    value={formData.location_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., St Leonards Masonic Hall"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="location_street"
                    value={formData.location_street}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., London Road"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    name="location_street_2"
                    value={formData.location_street_2}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Optional additional address line"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="location_city"
                      value={formData.location_city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., St Leonards-on-Sea"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Post Code *
                    </label>
                    <input
                      type="text"
                      name="location_post_code"
                      value={formData.location_post_code}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., TN37 6AY"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit">
                    {editingId ? 'Update Location' : 'Add Location'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Locations List */}
        <div className="space-y-4">
          {locations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No locations added yet</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Location
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map(location => (
                <Card key={location.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {location.location_name}
                        </h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {formatLocationAddress(location)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => editLocation(location)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteLocation(location.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}