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
import { cn } from '@workspace/ui/lib/utils';

function defaultNavItems(workspaceId: string) {
  return [
    {
      title: 'Dashboard',
      url: `/workspace/${workspaceId}/dashboard`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Meetings',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Meeting 1',
          url: '#',
        },
        {
          title: 'Meeting 2',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: `/workspace/${workspaceId}/settings`,
      icon: Settings2,
    },
  ];
}


export function NavMain({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  function isActive(url: string) {
    return pathname.includes(url);
  }
  return (
    <SidebarGroup>
      <SidebarMenu>
        {defaultNavItems(workspaceId).map((item) => {
          const active = isActive(item.url);
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} asChild isActive={active}>
                    {!item.items?.length ?
                      <Link href={item.url} className={cn(
                        active && 'bg-accent text-accent-foreground dark:shadow-lg'
                      )}>
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
                      {item.items?.map((subItem) => (
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
            </Collapsible>)
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
