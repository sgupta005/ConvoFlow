import { auth } from '@/lib/auth';
import {
  SidebarProvider,
} from '@workspace/ui/components/sidebar';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LayouClient } from './layout-client';
import { AppSidebar } from '@/components/app-sidebar';

export default async function Page({ params, children }: { params: Promise<{ id: string }>, children: Readonly<React.ReactNode> }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect('/login');


  return (
    <SidebarProvider>
      <AppSidebar workspaceId={id} />
      <LayouClient>{children}</LayouClient>
    </SidebarProvider>
  );
}
