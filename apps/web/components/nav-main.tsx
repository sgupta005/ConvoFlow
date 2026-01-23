'use client';

import {
  ArrowLeft,
  ChevronRight,
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
import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Meeting } from '@workspace/db';
import { SearchMeeting } from '@/features/meetings/components/search-meeting';
import { defaultNavItems, meetingNavItems } from '@/lib/nav-items';

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

  const isMeetingPage = pathname.includes('/meeting')
  const navItems = isMeetingPage ? meetingNavItems : defaultNavItems(workspaceId, meetings);

  return (
    <>
      {isMeetingPage &&
        <Button
          className="w-max -mb-3 text-muted-foreground hover:text-foreground hover:bg-transparent bg-transparent shadow-none"
          asChild
        >
          <Link href={`/workspace/${workspaceId}/dashboard`}>
            <ArrowLeft />
            <span className="text-xs tracking-tight">DASHBOARD</span>
          </Link>
        </Button>
      }
      <SidebarGroup>
        <SidebarMenu>
          {navItems.map((item) =>
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
    </>
  );
}
