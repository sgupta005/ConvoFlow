import { z } from 'zod';

// Client -> Server Messages (Control Messages)
export const StartSessionMessageSchema = z.object({
  type: z.literal('start-session'),
  meetingId: z.string(),
});

export const StopSessionMessageSchema = z.object({
  type: z.literal('stop-session'),
});

export const ClientMessageSchema = z.discriminatedUnion('type', [
  StartSessionMessageSchema,
  StopSessionMessageSchema,
]);

// Server -> Client Messages (Response Messages)
export const SessionStartedMessageSchema = z.object({
  type: z.literal('session-started'),
  sessionId: z.string(),
});

export const SessionStoppedMessageSchema = z.object({
  type: z.literal('session-stopped'),
  sessionId: z.string(),
  chunkCount: z.number(),
  duration: z.number(),
});

export const TranscriptMessageSchema = z.object({
  type: z.literal('transcript'),
  sessionId: z.string(),
  text: z.string(),
  isFinal: z.boolean(),
});

export const ServerMessageSchema = z.discriminatedUnion('type', [
  SessionStartedMessageSchema,
  SessionStoppedMessageSchema,
  TranscriptMessageSchema,
]);

// Session metadata
export const SessionSchema = z.object({
  id: z.string(),
  startTime: z.date(),
  chunkCount: z.number(),
});

// Type exports
export type StartSessionMessage = z.infer<typeof StartSessionMessageSchema>;
export type StopSessionMessage = z.infer<typeof StopSessionMessageSchema>;
export type ClientMessage = z.infer<typeof ClientMessageSchema>;

export type SessionStartedMessage = z.infer<typeof SessionStartedMessageSchema>;
export type SessionStoppedMessage = z.infer<typeof SessionStoppedMessageSchema>;
export type TranscriptMessage = z.infer<typeof TranscriptMessageSchema>;
export type ServerMessage = z.infer<typeof ServerMessageSchema>;

export type Session = z.infer<typeof SessionSchema>;
