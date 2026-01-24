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
import { toast } from "@workspace/ui/components/sonner";
import { Spinner } from "@workspace/ui/components/spinner";
import { useState } from "react";
import { redirect } from "next/navigation";

import { deleteMeetingAction } from "../actions";

interface DeleteMeetingDialogProps {
  meetingId: string,
  userId: string,
  meetingTitle: string
}

export function DeleteMeetingDialog({
  meetingId,
  userId,
  meetingTitle
}: DeleteMeetingDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteMeeting() {
    setIsDeleting(true);
    await deleteMeetingAction(meetingId, userId).then(result => {
      if (result.success) {
        toast.success(`${meetingTitle} deleted successfully!`)
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
        <Button variant="destructive">Delete Meeting</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Meeting?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and will permanently delete all data
            associated with this meeting.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteMeeting} disabled={isDeleting}>{isDeleting && <Spinner />} Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
