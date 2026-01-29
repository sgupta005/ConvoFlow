'use server';

import { checkUserOwnsWorkspace, createWorkspace, deleteWorkspace, getUserDefaultWorkspace, getWorkspaceById, prisma, updateWorkspace, WorkspaceRole } from '@workspace/db';
import {
  createWorkspaceSchema,
  CreateWorkspaceSchema,
} from '@workspace/contracts';
import { revalidatePath } from 'next/cache';

export async function createWorkspaceAction(workspace: CreateWorkspaceSchema) {
  try {
    const { success, data } = createWorkspaceSchema.safeParse(workspace);
    if (!success) {
      return { success: false, error: 'Invalid workspace data' };
    }
    const newWorkspace = await createWorkspace(data);
    return { success: true, data: newWorkspace };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create workspace',
    };
  }
}

export async function deleteWorkspaceAction(workspaceId: string, userId: string) {
  try {
    //check if user owns the workspace. 
    const userOwnsWorkspace = checkUserOwnsWorkspace(workspaceId, userId);
    if (!userOwnsWorkspace) throw new Error('Only the owner can delete the workspace.')

    //check that the workspace is not the default workspace
    const workspace = await getWorkspaceById(workspaceId);
    if (!workspace || workspace.is_default) throw new Error('Deafult Workspace cannot be deleted.')

    await deleteWorkspace(workspaceId)
    return { success: true }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An Error occured while trying to delete the workspace.'
    };
  }
}

export async function makeWorkspaceDefault(workspaceId: string, userId: string) {
  try {
    //check if the user owns the workspace
    const userOwnsWorkspace = checkUserOwnsWorkspace(workspaceId, userId);
    if (!userOwnsWorkspace) throw new Error('Only the owner can delete the workspace.')

    //find the current default workspace and make is_default false
    const defaultWorkspace = await getUserDefaultWorkspace(userId);
    if (defaultWorkspace)
      await updateWorkspace(defaultWorkspace.id, { is_default: false })

    await updateWorkspace(workspaceId, { is_default: true })

    revalidatePath(`/workspace/${workspaceId}/settings`)

    return { success: true }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An Error occured while trying to make the workspace Default.'
    };
  }
}

export async function renameWorkspace(workspaceId: string, userId: string, newName: string) {
  try {
    //check if the user owns the workspace
    const userOwnsWorkspace = checkUserOwnsWorkspace(workspaceId, userId);
    if (!userOwnsWorkspace) throw new Error('Only the owner can delete the workspace.')

    await updateWorkspace(workspaceId, { name: newName })

    revalidatePath(`/workspace/${workspaceId}/settings`)

    return { success: true }

  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An Error occured while trying to Rename the workspace.'
    };
  }
}

