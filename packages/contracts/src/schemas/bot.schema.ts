// packages/contracts/src/jobs/spawn-bot.ts
import { z } from 'zod';

export const SpawnBotPayloadSchema = z
  .object({
    meetingId: z.string().min(1),
    meetUrl: z.string().url(),
    requestedByUserId: z.string().min(1),
  })
  .strict();

export type SpawnBotPayload = z.infer<typeof SpawnBotPayloadSchema>;
