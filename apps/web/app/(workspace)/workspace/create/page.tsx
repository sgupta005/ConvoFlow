import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { auth } from '@/lib/auth';
import { CreateWorkspaceForm } from '@/features/workspace/components/create-workspace-form';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CreateWorkspacePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect('/login');
  return (
    <Card className="flex w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Workspace</CardTitle>
        <CardDescription>
          Create a new workspace to start collaborating with your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateWorkspaceForm userId={session?.user?.id ?? ''} />
      </CardContent>
    </Card>
  );
}
