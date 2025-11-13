// src/pages/AdminRecurringMeetingForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Save, Plus, Trash2, Calendar } from 'lucide-react';
import type { ChapterMeetingRule, RecurrencePatternItem } from '../types/chapter-meetings-admin';
import {
  DAYS_OF_WEEK,
  WEEK_POSITIONS,
  MONTHS,
  MEETING_TYPES,
  formatRecurrencePattern,
  getNextMeetingDate,
} from '../types/chapter-meetings-admin';
import LocationSelector from '../components/LocationSelector';

export default function AdminRecurringMeetingForm() {
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
    meeting_time: string;
    meeting_contact: string;
    meeting_type: 'regular' | 'exaltation' | 'installation' | 'special';
    years_ahead: number;
    active: boolean;
    end_date: string;
  }>({
    chapter_name: '',
    chapter_number: '',
    location_name: '',
    address: '',
    location_id: null,
    meeting_time: '',
    meeting_contact: '',
    meeting_type: 'regular',
    years_ahead: 2,
    active: true,
    end_date: '',
  });

  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePatternItem[]>([
    { month: 1, week: 1, day: 1 }, // Default: 1st Monday of January
  ]);

  useEffect(() => {
    if (isEditing) {
      loadRule();
    }
  }, [id]);

  async function loadRule() {
    try {
      const { data, error } = await supabase
        .from('chapter_meeting_rules')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const rule = data as ChapterMeetingRule;
        setFormData({
          chapter_name: rule.chapter_name,
          chapter_number: rule.chapter_number,
          location_name: rule.location_name,
          address: rule.address,
          location_id: (rule as any).location_id || null,
          meeting_time: rule.meeting_time,
          meeting_contact: rule.meeting_contact || '',
          meeting_type: rule.meeting_type,
          years_ahead: rule.years_ahead,
          active: rule.active,
          end_date: rule.end_date || '',
        });
        setRecurrencePattern(rule.recurrence_pattern);
      }
    } catch (error) {
      console.error('Error loading rule:', error);
      alert('Failed to load rule');
      navigate('/admin/meetings');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (recurrencePattern.length === 0) {
      alert('Please add at least one recurrence pattern');
      return;
    }

    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        meeting_contact: formData.meeting_contact || null,
        end_date: formData.end_date || null,
        location_id: formData.location_id || null,
        recurrence_pattern: recurrencePattern,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('chapter_meeting_rules')
          .update(dataToSave)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('chapter_meeting_rules')
          .insert([dataToSave]);

        if (error) throw error;
      }

      navigate('/admin/meetings');
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Failed to save rule');
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
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const addPatternItem = () => {
    setRecurrencePattern([
      ...recurrencePattern,
      { month: 1, week: 1, day: 1 }
    ]);
  };

  const removePatternItem = (index: number) => {
    if (recurrencePattern.length === 1) {
      alert('Must have at least one pattern');
      return;
    }
    setRecurrencePattern(recurrencePattern.filter((_, i) => i !== index));
  };

  const updatePatternItem = (index: number, field: keyof RecurrencePatternItem, value: number) => {
    const updated = [...recurrencePattern];
    updated[index] = { ...updated[index], [field]: value };
    setRecurrencePattern(updated);
  };

  const nextMeeting = getNextMeetingDate(recurrencePattern);

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
              {isEditing ? 'Edit Recurring Rule' : 'New Recurring Rule'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chapter Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Chapter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Recurrence Pattern Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recurrence Pattern</CardTitle>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addPatternItem}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pattern
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Define when meetings occur. For example: "2nd Tuesday of February" or "Last Thursday of November"
              </p>

              {recurrencePattern.map((pattern, index) => (
                <div key={index} className="flex flex-wrap items-end gap-3 p-4 border rounded-lg">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-sm font-medium mb-2">Week</label>
                    <select
                      value={pattern.week}
                      onChange={(e) => updatePatternItem(index, 'week', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {WEEK_POSITIONS.map(week => (
                        <option key={week.value} value={week.value}>
                          {week.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-sm font-medium mb-2">Day</label>
                    <select
                      value={pattern.day}
                      onChange={(e) => updatePatternItem(index, 'day', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-sm font-medium mb-2">Month</label>
                    <select
                      value={pattern.month}
                      onChange={(e) => updatePatternItem(index, 'month', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {MONTHS.map(month => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removePatternItem(index)}
                    disabled={recurrencePattern.length === 1}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Pattern Preview */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Pattern Summary:</p>
                <p className="text-sm text-blue-900">{formatRecurrencePattern(recurrencePattern)}</p>
                {nextMeeting && (
                  <p className="text-sm text-blue-700 mt-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Next meeting: {nextMeeting.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generation Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Years Ahead to Generate *
                </label>
                <input
                  type="number"
                  name="years_ahead"
                  value={formData.years_ahead}
                  onChange={handleChange}
                  required
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How many years into the future to auto-generate meetings (1-10)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave blank to generate indefinitely
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  id="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label htmlFor="active" className="text-sm font-medium">
                  Active (rule will auto-generate meetings)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : isEditing ? 'Update Rule' : 'Create Rule'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/meetings')}
            >
              Cancel
            </Button>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900">
              <strong>Note:</strong> After creating this rule, you'll need to click "Generate Meetings" 
              to create the actual meeting dates based on this pattern.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}