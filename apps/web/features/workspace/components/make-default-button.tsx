"use client"

import { Button } from "@workspace/ui/components/button"
import { makeWorkspaceDefault } from "../actions"
import { toast } from '@workspace/ui/components/sonner';
import { useTransition } from "react";
import { Spinner } from "@workspace/ui/components/spinner";

interface MakeDefaultButtonProps {
  workspaceName: string
  workspaceId: string
  userId: string
}

export function MakeDefaultButton({ workspaceName, workspaceId, userId, }: MakeDefaultButtonProps) {
  const [isPending, startTransition] = useTransition();

  async function handleMakeDefault() {
    startTransition(async () => {
      await makeWorkspaceDefault(workspaceId, userId).then(result => result.success ? toast.success(`${workspaceName} is now the Default Workspace!`) : toast.error(result.error))
    })
  }

  return (
    <Button variant="outline" className='mr-0 ml-auto' onClick={handleMakeDefault} disabled={isPending}>
      {isPending && <Spinner data-icon='inline-start' />} Make Default
    </Button>
  )
}
