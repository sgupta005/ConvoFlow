import { z } from 'zod';

export const createMeetingSchema = z.object({
  name: z.string().min(1, { message: 'Meeting name is required' }),
  workspaceId: z.string().min(1, { message: 'Workspace ID is required' }),
  meetUrl: z.string().url({ message: 'Valid meeting URL is required' }),
  requestedByUserId: z.string().min(1, { message: 'User ID is required' }),
});

export const meetingSchema = z.object({
  id: z.string(),
  name: z.string(),
  workspaceId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Meeting = z.infer<typeof meetingSchema>;
export type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;
