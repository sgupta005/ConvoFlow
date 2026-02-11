import { Prisma } from '@workspace/db';
import { format, isAfter, startOfWeek, subWeeks } from 'date-fns';

export interface DashboardStats {
  totalMeetings: number;
  liveMeetings: number;
  hoursTranscribed: number;
  completedMeetings: number;
}

export interface WeeklyData {
  week: string;
  count: number;
}

export function computeStats(meetings: Prisma.MeetingGetPayload<{}>[]): DashboardStats {
  const totalMeetings = meetings.length;
  const liveMeetings = meetings.filter(m => m.is_live).length;
  const completedMeetings = meetings.filter(m => !m.is_live).length;

  // Calculate hours transcribed from meetings with both startTime and endTime
  const hoursTranscribed = meetings.reduce((total, meeting) => {
    if (meeting.startTime && meeting.endTime) {
      const durationMs = meeting.endTime.getTime() - meeting.startTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      return total + durationHours;
    }
    return total;
  }, 0);

  return {
    totalMeetings,
    liveMeetings,
    hoursTranscribed: Math.round(hoursTranscribed * 10) / 10, // Round to 1 decimal
    completedMeetings,
  };
}

export function groupByWeek(meetings: Prisma.MeetingGetPayload<{}>[]): WeeklyData[] {
  const now = new Date();
  const eightWeeksAgo = subWeeks(now, 8);

  // Filter meetings from last 8 weeks
  const recentMeetings = meetings.filter(m => isAfter(m.createdAt, eightWeeksAgo));

  // Group by week
  const weekMap = new Map<string, number>();

  // Initialize all 8 weeks with 0
  for (let i = 7; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 0 });
    const weekLabel = format(weekStart, 'MMM d');
    weekMap.set(weekLabel, 0);
  }

  // Count meetings per week - use the meeting's actual date
  recentMeetings.forEach((meeting) => {
    const weekStart = startOfWeek(meeting.createdAt, { weekStartsOn: 0 });
    const weekLabel = format(weekStart, 'MMM d');
    weekMap.set(weekLabel, (weekMap.get(weekLabel) || 0) + 1);
  });

  // Convert to array and sort by date
  return Array.from(weekMap.entries()).map(([week, count]) => ({
    week,
    count,
  }));
}