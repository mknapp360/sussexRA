// src/pages/AdminMeetingForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import type { ChapterMeeting } from '../types/chapter-meetings';
import { MEETING_TYPES } from '../types/chapter-meetings-admin';
import LocationSelector from '../components/LocationSelector';

export default function AdminMeetingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    chapter_name: string;
    chapter_number: string;
    location_name: string;
    address: string;
    location_id: string | null;
    meeting_date: string;
    meeting_time: string;
    meeting_contact: string;
    meeting_type: 'regular' | 'exaltation' | 'installation' | 'special';
    published: boolean;
  }>({
    chapter_name: '',
    chapter_number: '',
    location_name: '',
    address: '',
    location_id: null,
    meeting_date: '',
    meeting_time: '',
    meeting_contact: '',
    meeting_type: 'regular',
    published: true,
  });

  useEffect(() => {
    if (isEditing) {
      loadMeeting();
    }
  }, [id]);

  async function loadMeeting() {
    try {
      const { data, error } = await supabase
        .from('chapter_meetings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const meeting = data as ChapterMeeting;
        setFormData({
          chapter_name: meeting.chapter_name,
          chapter_number: meeting.chapter_number,
          location_name: meeting.location_name,
          address: meeting.address,
          location_id: (meeting as any).location_id || null,
          meeting_date: meeting.meeting_date,
          meeting_time: meeting.meeting_time,
          meeting_contact: meeting.meeting_contact || '',
          meeting_type: meeting.meeting_type,
          published: meeting.published,
        });
      }
    } catch (error) {
      console.error('Error loading meeting:', error);
      alert('Failed to load meeting');
      navigate('/admin/meetings');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        meeting_contact: formData.meeting_contact || null,
        location_id: formData.location_id || null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('chapter_meetings')
          .update(dataToSave)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('chapter_meetings')
          .insert([dataToSave]);

        if (error) throw error;
      }

      navigate('/admin/meetings');
    } catch (error) {
      console.error('Error saving meeting:', error);
      alert('Failed to save meeting');
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-30 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/meetings')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Edit Meeting' : 'New Meeting'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Chapter Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chapter Name *
                  </label>
                  <input
                    type="text"
                    name="chapter_name"
                    value={formData.chapter_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Royal Sussex Chapter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chapter Number *
                  </label>
                  <input
                    type="text"
                    name="chapter_number"
                    value={formData.chapter_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 1234"
                  />
                </div>
              </div>

              {/* Meeting Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meeting Type *
                </label>
                <select
                  name="meeting_type"
                  value={formData.meeting_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {MEETING_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meeting Date *
                  </label>
                  <input
                    type="date"
                    name="meeting_date"
                    value={formData.meeting_date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meeting Time *
                  </label>
                  <input
                    type="text"
                    name="meeting_time"
                    value={formData.meeting_time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 19:00 or 7:00 PM"
                  />
                </div>
              </div>

              {/* Location Selector */}
              <LocationSelector
                selectedLocationId={formData.location_id}
                manualLocationName={formData.location_name}
                manualAddress={formData.address}
                onLocationSelect={(locationId) => {
                  setFormData(prev => ({ ...prev, location_id: locationId }));
                }}
                onManualChange={(locationName, address) => {
                  setFormData(prev => ({
                    ...prev,
                    location_name: locationName,
                    address: address,
                  }));
                }}
                required={true}
              />

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Information
                </label>
                <input
                  type="text"
                  name="meeting_contact"
                  value={formData.meeting_contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Email or phone number (optional)"
                />
              </div>

              {/* Published */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="published"
                  id="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-sm font-medium">
                  Published (visible on public calendar)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : isEditing ? 'Update Meeting' : 'Create Meeting'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/meetings')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}