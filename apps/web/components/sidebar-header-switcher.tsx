'use client';

import { usePathname } from 'next/navigation';
import { MeetingSwitcher } from '@/features/meetings/components/meeting-switcher';
import { WorkspaceSwitcher } from '@/features/workspace/components/workspace-switcher';
import { Prisma } from '@workspace/db';

interface SidebarHeaderSwitcherProps {
  workspaces: Prisma.WorkspaceGetPayload<{}>[];
  meetings: Prisma.MeetingGetPayload<{}>[];
  userId: string;
}

export function SidebarHeaderSwitcher({
  workspaces,
  meetings,
  userId,
}: SidebarHeaderSwitcherProps) {
  const pathname = usePathname();
  const isMeetingPage = pathname?.includes('meeting') ?? false;

  if (isMeetingPage) {
    return <MeetingSwitcher meetings={meetings} userId={userId} />;
  }

  return <WorkspaceSwitcher workspaces={workspaces} userId={userId} />;
}
