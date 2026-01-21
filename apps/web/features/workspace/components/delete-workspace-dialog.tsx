'use client';

import { Trash2Icon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { toast } from "@workspace/ui/components/sonner";
import { Spinner } from "@workspace/ui/components/spinner";
import { useState } from "react";
import { redirect } from "next/navigation";

import { deleteWorkspaceAction } from "../actions";

interface DeleteWorkspaceDialogProps {
  workspaceId: string,
  userId: string,
  isDefault: boolean,
  workspaceName: string
}

export function DeleteWorkspaceDialog({
  workspaceId,
  userId,
  isDefault,
  workspaceName
}: DeleteWorkspaceDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteWorkspace() {
    setIsDeleting(true);
    await deleteWorkspaceAction(workspaceId, userId).then(result => {
      if (result.success) {
        toast.success(`${workspaceName} deleted successfully!`)
        redirect('/')
      } else {
        toast.error(result.error)
      }
    }
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isDefault ? <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-block w-fit">
              <Button variant="destructive" disabled>Delete Workspace</Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">
            Default Workspace cannot be deleted. Make another <br /> workspace default to delete this workspace.
          </TooltipContent>
        </Tooltip>
          :
          <Button variant="destructive">Delete Workspace</Button>
        }
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will permanently delete all data
            associated with this workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteWorkspace} disabled={isDeleting}>{isDeleting && <Spinner />} Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
