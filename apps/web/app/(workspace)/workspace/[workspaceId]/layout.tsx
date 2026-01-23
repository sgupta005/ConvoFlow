import { auth } from '@/lib/auth';
import {
  SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LayouClient } from './layout-client';
import { AppSidebar } from '@/components/app-sidebar';
import { getMeetingsByWorkspace } from '@workspace/db';

export default async function Page({ params, children }: { params: Promise<{ workspaceId: string }>, children: Readonly<React.ReactNode> }) {
  const { workspaceId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect('/login');

  const meetings = await getMeetingsByWorkspace(workspaceId);

  return (
    <SidebarProvider>
      <AppSidebar workspaceId={workspaceId} meetings={meetings} />
      <LayouClient>{children}</LayouClient>
    </SidebarProvider>
  );
}
