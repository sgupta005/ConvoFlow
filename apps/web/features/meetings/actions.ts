'use server';

import { revalidatePath } from "next/cache";
import { deleteMeeting, updateMeeting } from "@workspace/db";
import { checkUserOwnsMeeting } from "@workspace/db";

export async function renameMeeting(meetingId: string, userId: string, newTitle: string) {
  try {
    //check if the user owns the meeting
    const userOwnsMeeting = checkUserOwnsMeeting(meetingId, userId);
    if (!userOwnsMeeting) throw new Error('Only the owner can delete the meeting.')

    await updateMeeting(meetingId, { title: newTitle })

    revalidatePath(`/meeting/${meetingId}/settings`)

    return { success: true }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An Error occured while trying to Rename the workspace.'
    };
  }
}

export async function deleteMeetingAction(meetingId: string, userId: string) {
  try {
    //check if user owns the workspace. 
    const userOwnsMeeting = checkUserOwnsMeeting(meetingId, userId);
    if (!userOwnsMeeting) throw new Error('Only the owner can delete the meeting.')

    await deleteMeeting(meetingId)
    return { success: true }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An Error occured while trying to delete the workspace.'
    };
  }
}

