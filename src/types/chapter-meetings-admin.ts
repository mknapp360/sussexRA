// src/types/chapter-meetings-admin.ts
// Enhanced TypeScript interfaces for admin meeting management

import type { MeetingType } from './chapter-meetings';

/**
 * Single recurrence pattern item
 * Defines when a meeting occurs (e.g., "2nd Tuesday of March")
 */
export interface RecurrencePatternItem {
  month: number;      // 1-12 (1=January, 12=December)
  week: number;       // 1-5 (1=first, 2=second, 3=third, 4=fourth, 5=last)
  day: number;        // 0-6 (0=Sunday, 1=Monday, 2=Tuesday, etc.)
}

/**
 * Meeting recurrence rule for auto-generating meetings
 */
export interface ChapterMeetingRule {
  area: "1066" | "Brighton" | "Chichester" | "Crawley" | "Eastbourne" | "Worthing";
  id: string;
  chapter_name: string;
  chapter_number: string;
  location_name: string;
  address: string;
  meeting_time: string;
  meeting_contact: string | null;
  meeting_type: MeetingType;
  recurrence_pattern: RecurrencePatternItem[];
  years_ahead: number;
  active: boolean;
  end_date: string | null;  // ISO date string
  last_generated_at: string | null;
  last_generated_until: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Form data for creating recurring meeting rule
 */
export interface RecurringMeetingFormData {
  chapter_name: string;
  chapter_number: string;
  location_name: string;
  address: string;
  meeting_time: string;
  meeting_contact?: string;
  meeting_type: MeetingType;
  recurrence_pattern: RecurrencePatternItem[];
  years_ahead?: number;
  end_date?: string;
}

/**
 * Helper constants
 */
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const WEEK_POSITIONS = [
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
  { value: 4, label: '4th' },
  { value: 5, label: 'Last' },
];

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

export const MEETING_TYPES = [
  { value: 'regular' as MeetingType, label: 'Regular Meeting', color: 'blue' },
  { value: 'exaltation' as MeetingType, label: 'Exaltation', color: 'red' },
  { value: 'installation' as MeetingType, label: 'Installation', color: 'purple' },
  { value: 'special' as MeetingType, label: 'Special Event', color: 'amber' },
];

/**
 * Format recurrence pattern for display
 * Example: "2nd Tuesday of February, March; 3rd Thursday of September, October"
 */
export function formatRecurrencePattern(pattern: RecurrencePatternItem[]): string {
  // Group by week+day combination
  const grouped = new Map<string, number[]>();
  
  pattern.forEach(item => {
    const key = `${item.week}-${item.day}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item.month);
  });
  
  // Format each group
  const parts: string[] = [];
  grouped.forEach((months, key) => {
    const [week, day] = key.split('-').map(Number);
    const weekLabel = WEEK_POSITIONS.find(w => w.value === week)?.label || week.toString();
    const dayLabel = DAYS_OF_WEEK.find(d => d.value === day)?.label || 'Day';
    const monthLabels = months
      .sort((a, b) => a - b)
      .map(m => MONTHS.find(mon => mon.value === m)?.label || m.toString())
      .join(', ');
    
    parts.push(`${weekLabel} ${dayLabel} of ${monthLabels}`);
  });
  
  return parts.join('; ');
}

/**
 * Calculate next meeting date from pattern
 */
export function getNextMeetingDate(pattern: RecurrencePatternItem[]): Date | null {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Check current year and next year
  for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
    const year = currentYear + yearOffset;
    
    for (const item of pattern) {
      const date = calculateNthWeekdayOfMonth(year, item.month, item.week, item.day);
      if (date > today) {
        return date;
      }
    }
  }
  
  return null;
}

/**
 * Calculate the nth occurrence of a weekday in a month
 */
export function calculateNthWeekdayOfMonth(
  year: number,
  month: number,
  week: number,
  dayOfWeek: number
): Date {
  const firstDay = new Date(year, month - 1, 1);
  const firstDow = firstDay.getDay();
  
  // Handle "last" occurrence
  if (week === 5) {
    const lastDay = new Date(year, month, 0);
    for (let i = 0; i <= 6; i++) {
      const checkDate = new Date(lastDay);
      checkDate.setDate(lastDay.getDate() - i);
      if (checkDate.getDay() === dayOfWeek) {
        return checkDate;
      }
    }
  }
  
  // Calculate offset to first occurrence
  let offset = dayOfWeek - firstDow;
  if (offset < 0) offset += 7;
  
  // Add weeks
  const targetDate = new Date(year, month - 1, 1 + offset + (week - 1) * 7);
  
  // Validate still in correct month
  if (targetDate.getMonth() !== month - 1) {
    throw new Error('Calculated date is outside target month');
  }
  
  return targetDate;
}