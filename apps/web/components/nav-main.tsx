'use client';

import {
  ChevronRight,
  Bot,
  Settings2,
  SquareTerminal,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@workspace/ui/components/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchMeeting } from '@/features/meetings/components/search-meeting';
import { useState } from 'react';
import { Meeting } from '@workspace/db';

function defaultNavItems(workspaceId: string, meetings: Meeting[]) {
  return [
    {
      title: 'Dashboard',
      url: `/workspace/${workspaceId}/dashboard`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Meetings',
      url: '/meeting/info',
      icon: Bot,
      items: meetings.map((meeting) => ({
        title: meeting.title,
        url: `/workspace/${workspaceId}/meeting/${meeting.id}`,
      })),
    },
    {
      title: 'Settings',
      url: `/workspace/${workspaceId}/settings`,
      icon: Settings2,
    },
  ];
}

interface NavMainProps {
  workspaceId: string;
  meetings: Meeting[];
}

export function NavMain({ workspaceId, meetings }: NavMainProps) {
  const [search, setSearch] = useState('');

  const pathname = usePathname();

  function isActive(url: string) {
    return pathname.includes(url);
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {defaultNavItems(workspaceId, meetings).map((item) =>
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} asChild isActive={isActive(item.url)}>
                  {!item.items?.length ?
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {item.items && item.items.length > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link> :
                    <span>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {item.items && item.items.length > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </span>
                  }
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && item.items.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SearchMeeting search={search} setSearch={setSearch} />
                    {item.items?.filter(subItem => subItem.title.toLowerCase().includes(search.toLowerCase())).map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
