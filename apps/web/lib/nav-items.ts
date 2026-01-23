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

export const meetingNavItems = [
  {
    title: 'Transcript',
    url: '/transcript',
    icon: FileText,
    isActive: false,
    items: []
  },
  {
    title: 'Summary',
    url: '/summary',
    icon: File,
    isActive: false,
    items: []

  },
  {
    title: 'Action Items',
    url: '/action-items',
    icon: FileCheck,
    isActive: false,
    items: []

  },
]