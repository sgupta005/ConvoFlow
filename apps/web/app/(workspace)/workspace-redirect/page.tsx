import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserFirstWorkspace } from '@workspace/db';
import { headers } from 'next/headers';

export default async function LoginRedirectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect('/login');

  const ws = await getUserFirstWorkspace(session.user.id);

  if (!ws) {
    redirect('/workspace/create');
  }

  redirect(`/workspace/${ws.id}/dashboard`);
}
