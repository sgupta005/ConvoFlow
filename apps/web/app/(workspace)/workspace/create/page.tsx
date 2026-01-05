import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { auth } from '@/auth';
import { CreateWorkspaceForm } from '@/features/workspace/components/create-workspace-form';

export default async function CreateWorkspacePage() {
  const session = await auth();
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
