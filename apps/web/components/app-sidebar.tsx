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
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getUserWorkspaces } from '@workspace/db';

export async function AppSidebar({
  workspaceId,
  ...props
}: React.ComponentProps<typeof Sidebar> & { workspaceId: string }) {

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect('/login');

  const workspaces = await getUserWorkspaces(session.user.id);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={workspaces} userId={session.user.id} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain workspaceId={workspaceId} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
