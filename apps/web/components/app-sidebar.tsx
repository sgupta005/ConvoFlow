import * as React from 'react';
import { redirect } from 'next/navigation';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { WorkspaceSwitcher } from '../features/workspace/components/workspace-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@workspace/ui/components/sidebar';
import { auth } from '@/auth';
import { getUserWorkspaces } from '@workspace/db';

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const workspaces = await getUserWorkspaces(session.user.id);

  if (workspaces.length === 0) {
    redirect('/workspace/create');
  }

  const userData = {
    name: session.user.name || 'User',
    email: session.user.email || '',
    avatar: session.user.image || '/avatars/default.jpg',
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
