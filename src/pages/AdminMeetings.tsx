// src/pages/AdminMeetings.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, Repeat, Pencil, Trash2, RefreshCw } from 'lucide-react';
import type { ChapterMeeting } from '../types/chapter-meetings';
import type { ChapterMeetingRule } from '../types/chapter-meetings-admin';
import { formatRecurrencePattern } from '../types/chapter-meetings-admin';

export default function AdminMeetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<ChapterMeeting[]>([]);
  const [rules, setRules] = useState<ChapterMeetingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'meetings' | 'past' | 'rules'>('meetings');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load all meetings (not just published for admin view)
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('chapter_meetings')
        .select('*')
        .order('meeting_date', { ascending: true });

      if (meetingsError) throw meetingsError;
      if (meetingsData) setMeetings(meetingsData as ChapterMeeting[]);

      // Load all rules
      const { data: rulesData, error: rulesError } = await supabase
        .from('chapter_meeting_rules')
        .select('*')
        .order('chapter_name', { ascending: true });

      if (rulesError) throw rulesError;
      if (rulesData) setRules(rulesData as ChapterMeetingRule[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMeeting(id: string) {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const { error } = await supabase
        .from('chapter_meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMeetings(meetings.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting meeting:', error);
      alert('Failed to delete meeting');
    }
  }

  async function deleteRule(id: string) {
    if (!confirm('Are you sure you want to delete this recurring rule? This will NOT delete meetings already generated from this rule.')) return;

    try {
      const { error } = await supabase
        .from('chapter_meeting_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRules(rules.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Failed to delete rule');
    }
  }

  async function toggleRuleActive(id: string, currentActive: boolean) {
    try {
      const { error } = await supabase
        .from('chapter_meeting_rules')
        .update({ active: !currentActive })
        .eq('id', id);

      if (error) throw error;

      setRules(rules.map(r => 
        r.id === id ? { ...r, active: !currentActive } : r
      ));
    } catch (error) {
      console.error('Error toggling rule:', error);
      alert('Failed to update rule');
    }
  }

  async function generateFromRule(ruleId: string) {
    if (!confirm('Generate meetings from this rule for the next 2 years?')) return;

    try {
      const { data, error } = await supabase.rpc('generate_meetings_from_rule', {
        rule_id: ruleId
      });

      if (error) throw error;

      alert(`Created ${data} new meetings!`);
      loadData();
    } catch (error) {
      console.error('Error generating meetings:', error);
      alert('Failed to generate meetings. Make sure the database function is installed.');
    }
  }

  async function generateAllMeetings() {
    if (!confirm('Generate meetings from ALL active rules? This may take a moment.')) return;

    setGeneratingAll(true);
    try {
      const { data, error } = await supabase.rpc('auto_generate_all_meetings');

      if (error) throw error;

      const totalCreated = data?.reduce((sum: number, row: any) => sum + row.meetings_created, 0) || 0;
      alert(`Generated ${totalCreated} new meetings from ${data?.length || 0} rules!`);
      loadData();
    } catch (error) {
      console.error('Error generating all meetings:', error);
      alert('Failed to generate meetings');
    } finally {
      setGeneratingAll(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'exaltation': return 'bg-red-100 text-red-800';
      case 'installation': return 'bg-purple-100 text-purple-800';
      case 'special': return 'bg-amber-100 text-amber-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Filter meetings by date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const upcomingMeetings = meetings.filter(m => new Date(m.meeting_date) >= today);
  const pastMeetings = meetings.filter(m => new Date(m.meeting_date) < today).reverse(); // Reverse so most recent past meetings are first

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading meetings...</p>
      </div>
    );
  }

  // Reusable meeting card component
  const MeetingCard = ({ meeting }: { meeting: ChapterMeeting }) => (
    <Card key={meeting.id}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">
                {meeting.chapter_name} - No. {meeting.chapter_number}
              </h3>
              <span className={`text-xs px-2 py-1 rounded ${getMeetingTypeColor(meeting.meeting_type)}`}>
                {meeting.meeting_type}
              </span>
              {meeting.generated_from_rule_id && (
                <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                  <Repeat className="w-3 h-3 inline mr-1" />
                  Auto-generated
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Date:</strong> {formatDate(meeting.meeting_date)}</p>
              <p><strong>Time:</strong> {meeting.meeting_time}</p>
              <p><strong>Location:</strong> {meeting.location_name}</p>
              <p><strong>Address:</strong> {meeting.address}</p>
              {meeting.meeting_contact && (
                <p><strong>Contact:</strong> {meeting.meeting_contact}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(`/admin/meetings/${meeting.id}/edit`)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteMeeting(meeting.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 z-30 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Meeting Management</h1>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/admin/meetings/new')} size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                New Meeting
              </Button>
              <Button onClick={() => navigate('/admin/meetings/recurring/new')} size="sm" variant="outline">
                <Repeat className="w-4 h-4 mr-2" />
                New Recurring Rule
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('meetings')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'meetings'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Upcoming Meetings ({upcomingMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'past'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Past Meetings ({pastMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'rules'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Recurring Rules ({rules.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'meetings' ? (
          <div className="space-y-4">
            {upcomingMeetings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No upcoming meetings scheduled</p>
                  <Button onClick={() => navigate('/admin/meetings/new')}>
                    Create First Meeting
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
            )}
          </div>
        ) : activeTab === 'past' ? (
          <div className="space-y-4">
            {pastMeetings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No past meetings recorded</p>
                </CardContent>
              </Card>
            ) : (
              pastMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button
                onClick={generateAllMeetings}
                disabled={generatingAll || rules.filter(r => r.active).length === 0}
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${generatingAll ? 'animate-spin' : ''}`} />
                Generate All Meetings
              </Button>
            </div>

            {rules.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Repeat className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No recurring rules yet</p>
                  <Button onClick={() => navigate('/admin/meetings/recurring/new')}>
                    Create First Rule
                  </Button>
                </CardContent>
              </Card>
            ) : (
              rules.map(rule => (
                <Card key={rule.id} className={!rule.active ? 'opacity-60' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {rule.chapter_name} - No. {rule.chapter_number}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded ${getMeetingTypeColor(rule.meeting_type)}`}>
                            {rule.meeting_type}
                          </span>
                          {!rule.active && (
                            <span className="text-xs px-2 py-1 rounded bg-slate-200 text-slate-600">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1 mb-3">
                          <p><strong>Pattern:</strong> {formatRecurrencePattern(rule.recurrence_pattern)}</p>
                          <p><strong>Time:</strong> {rule.meeting_time}</p>
                          <p><strong>Location:</strong> {rule.location_name}</p>
                          {rule.last_generated_at && (
                            <p><strong>Last Generated:</strong> {new Date(rule.last_generated_at).toLocaleDateString()}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateFromRule(rule.id)}
                          disabled={!rule.active}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Generate Meetings
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleRuleActive(rule.id, rule.active)}
                        >
                          {rule.active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/meetings/recurring/${rule.id}/edit`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteRule(rule.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}