import {
  Bot,
  Settings2,
  SquareTerminal,
  FileText,
  FileCheck,
  File,
} from 'lucide-react';
import { Meeting } from '@workspace/db';

export function defaultNavItems(workspaceId: string, meetings: Meeting[]) {
  return [
    {
      title: 'Dashboard',
      url: `/workspace/${workspaceId}/dashboard`,
      icon: SquareTerminal,
      isActive: false,
      items: []
    },
    {
      title: 'Meetings',
      url: '/meeting/info',
      icon: Bot,
      isActive: false,
      items: meetings.map((meeting) => ({
        title: meeting.title,
        url: `/workspace/${workspaceId}/meeting/${meeting.id}/transcript`,
        isLive: meeting.is_live,
      })),
    },
    {
      title: 'Settings',
      url: `/workspace/${workspaceId}/settings`,
      icon: Settings2,
      isActive: false,
      items: []
    },
  ];
}

export function meetingNavItems(workspaceId: string, meetingId: string) {
  return [
    {
      title: 'Transcript',
      url: `/workspace/${workspaceId}/meeting/${meetingId}/transcript`,
      icon: FileText,
      isActive: false,
      items: []
    },
    {
      title: 'Summary',
      url: `/workspace/${workspaceId}/meeting/${meetingId}/summary`,
      icon: File,
      isActive: false,
      items: []
    },
    {
      title: 'Action Items',
      url: `/workspace/${workspaceId}/meeting/${meetingId}/action-items`,
      icon: FileCheck,
      isActive: false,
      items: []
    },
    {
      title: 'Settings',
      url: `/workspace/${workspaceId}/meeting/${meetingId}/settings`,
      icon: Settings2,
      isActive: false,
      items: []
    },
  ]
}