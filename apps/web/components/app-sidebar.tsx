import * as React from 'react';
import { redirect } from 'next/navigation';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { SidebarHeaderSwitcher } from '@/components/sidebar-header-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@workspace/ui/components/sidebar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

import { Meeting } from '@workspace/db';
import { getUserWorkspaces } from '@workspace/db';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  meetings: Meeting[];
}

export async function AppSidebar({
  meetings,
  ...props
}: AppSidebarProps) {

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect('/login');

  const workspaces = await getUserWorkspaces(session.user.id);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderSwitcher
          workspaces={workspaces}
          meetings={meetings}
          userId={session.user.id}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain meetings={meetings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
