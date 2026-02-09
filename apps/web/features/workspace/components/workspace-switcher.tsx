'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { notFound, useRouter } from 'next/navigation';

import * as React from 'react';

import { Prisma } from '@workspace/db';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { Badge } from '@workspace/ui/components/badge';
import { ChevronsUpDown, Plus } from 'lucide-react';

import { CreateWorkspaceDialog } from './create-workspace-dialog';

interface WorkspaceSwitcherProps {
  workspaces: Prisma.WorkspaceGetPayload<{}>[],
  userId: string
}

export function WorkspaceSwitcher({ workspaces, userId }: WorkspaceSwitcherProps) {
  const [showDialog, setShowDialog] = React.useState(false)

  const { isMobile } = useSidebar();
  const router = useRouter();
  const params = useParams();

  const currentWorkspaceId = params.workspaceId as string;

  // Find current workspace or default to first one
  const activeWorkspace =
    workspaces.find((w) => w.id === currentWorkspaceId);
  if (!activeWorkspace) return notFound();

  const handleWorkspaceSwitch = (workspace: Prisma.WorkspaceGetPayload<{}>) => {
    if (workspace.id !== currentWorkspaceId) {
      router.push(`/workspace/${workspace.id}/dashboard`);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {activeWorkspace.image ? (
                  <Image
                    src={activeWorkspace.image}
                    alt={`${activeWorkspace.name} logo`}
                    width={16}
                    height={16}
                    className="size-4 rounded-sm"
                  />
                ) : activeWorkspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeWorkspace.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Workspace
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => handleWorkspaceSwitch(workspace)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {workspace.image ? (
                    <Image
                      src={workspace.image}
                      alt={`${workspace.name} logo`}
                      width={14}
                      height={14}
                      className="size-3.5 rounded-sm shrink-0"
                    />
                  ) : workspace.name.charAt(0).toUpperCase()}
                </div>
                {workspace.name}
                {workspace.is_default && (
                  <Badge variant="outline">Default</Badge>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onSelect={() => setShowDialog(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateWorkspaceDialog
          userId={userId}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
