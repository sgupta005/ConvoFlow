import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  image: z.string().optional(),
  isDefault: z.boolean().default(false)
});

export const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  is_default: z.boolean(),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type CreateWorkspaceSchema = z.input<typeof createWorkspaceSchema>;
