import { getWorkspaceById } from "@workspace/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { RenameWorkspaceForm } from "@/features/workspace/components/rename-workspace-form";
import { DeleteWorkspaceDialog } from "@/features/workspace/components/delete-workspace-dialog";
import { MakeDefaultButton } from "@/features/workspace/components/make-default-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page({ params }: {
  params: Promise<{ workspaceId: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { workspaceId } = await params;

  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace || !session) return notFound();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">{workspace.name}</h1>
          {workspace.is_default ? (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="text-md px-3">Default Workspace</Badge>
              </TooltipTrigger>
              <TooltipContent>
                All your meetings get added to this workspace by default.
              </TooltipContent>
            </Tooltip>
          ) :
            <MakeDefaultButton
              workspaceName={workspace.name}
              workspaceId={workspace.id}
              userId={session.session.userId}
            />
          }
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your workspace settings
        </p>
      </div>
      <Separator />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Workspace Details</CardTitle>
            <CardDescription>
              Update your workspace name and configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RenameWorkspaceForm
              workspaceId={workspace.id}
              currentName={workspace.name}
              userId={session.session.userId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that affect this workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteWorkspaceDialog
              workspaceName={workspace.name}
              workspaceId={workspace.id}
              userId={session?.session.id}
              isDefault={workspace.is_default}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}