import { z } from 'zod';

export const TranscriptChunkSchema = z.object({
  meetingId: z.string(),
  speaker: z.string().optional(),
  text: z.string(),
  ts: z.number().optional(),
  lang: z.string().optional(),
});

export type TranscriptChunk = z.infer<typeof TranscriptChunkSchema>;
