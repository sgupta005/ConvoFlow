import { notFound } from 'next/navigation';

import { Video, Radio, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';

import { getMeetingsByWorkspace, getWorkspaceById } from '@workspace/db';
import { computeStats, groupByWeek } from '@/features/dashboard/lib/dashboard-utils';
import { StatCard } from '@/features/dashboard/components/stat-card';
import { MeetingActivityChart } from '@/features/dashboard/components/meeting-activity-chart';
import { RecentMeetings } from '@/features/dashboard/components/recent-meetings';
import { NoMeetingsEmptyState } from '@/features/meetings/components/no-meetings-empty-state';

export default async function DashboardPage({ params }: {
  params: Promise<{
    workspaceId: string;
  }>;
}) {
  const { workspaceId } = await params;

  const meetings = await getMeetingsByWorkspace(workspaceId);

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) return notFound();

  // If no meetings, show empty state
  if (meetings.length === 0) {
    return <NoMeetingsEmptyState />;
  }

  // Compute stats and data for charts
  const stats = computeStats(meetings);
  const weeklyData = groupByWeek(meetings);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold tracking-tight">{workspace.name}</h1>
          {workspace.is_default && (
            <Badge variant="secondary" className="text-md px-3">Default Workspace</Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Overview of your workspace meetings
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Video}
          label="Total Meetings"
          value={stats.totalMeetings}
        />
        <StatCard
          icon={Radio}
          label="Live Now"
          value={stats.liveMeetings}
          iconClassName={stats.liveMeetings > 0 ? 'text-green-500' : undefined}
        />
        <StatCard
          icon={Clock}
          label="Hours Transcribed"
          value={`${stats.hoursTranscribed}h`}
        />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={stats.completedMeetings}
        />
      </div>

      {/* Chart and Recent Meetings */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MeetingActivityChart weeklyData={weeklyData} />
        </div>
        <div className="lg:col-span-2">
          <RecentMeetings meetings={meetings} workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  );
}
