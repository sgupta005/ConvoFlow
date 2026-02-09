'use client';

import { useParams } from 'next/navigation';
import { notFound, useRouter } from 'next/navigation';

import * as React from 'react';

import { Prisma } from '@workspace/db';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { ChevronsUpDown } from 'lucide-react';

interface MeetingSwitcherProps {
  meetings: Prisma.MeetingGetPayload<{}>[],
  userId: string
}

export function MeetingSwitcher({ meetings, userId }: MeetingSwitcherProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const params = useParams();

  const currentMeetingId = params.meetingId as string;

  // Find current workspace or default to first one
  const activeMeeting =
    meetings.find((m) => m.id === currentMeetingId);
  if (!activeMeeting) return notFound();

  const handleMeetingSwitch = (meeting: Prisma.MeetingGetPayload<{}>) => {
    if (meeting.id !== currentMeetingId) {
      router.push(`/workspace/${meeting.workspaceId}/meeting/${meeting.id}/transcript`);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeMeeting.title.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeMeeting.title}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Meeting
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Meetings
            </DropdownMenuLabel>
            {meetings.map((meeting, index) => (
              <DropdownMenuItem
                key={meeting.id}
                onClick={() => handleMeetingSwitch(meeting)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {meeting.title.charAt(0).toUpperCase()}
                </div>
                {meeting.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
