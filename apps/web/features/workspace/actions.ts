'use server';

import { createWorkspace } from '@workspace/db';
import {
  createWorkspaceSchema,
  CreateWorkspaceSchema,
} from '@workspace/contracts';

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
      error:
        error instanceof Error ? error.message : 'Failed to create workspace',
    };
  }
}
