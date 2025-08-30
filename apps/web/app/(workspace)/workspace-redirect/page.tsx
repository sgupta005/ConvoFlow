import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserFirstWorkspace } from '@workspace/db';

export default async function LoginRedirectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const ws = await getUserFirstWorkspace(session.user.id);

  if (!ws) {
    redirect('/workspace/create');
  }

  redirect(`/workspace/${ws.id}/dashboard`);
}
