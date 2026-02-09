import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, { message: 'Name is required' }),
  image: z.string().optional(),
  isDefault: z.boolean().default(false)
});

export type CreateWorkspaceSchema = z.input<typeof createWorkspaceSchema>;
