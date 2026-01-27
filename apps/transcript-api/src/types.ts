import type { LiveClient } from '@deepgram/sdk';

export interface Session {
  id: string;
  meetingId: string;
  deepgramConnection: LiveClient;
  startTime: Date;
  chunkCount: number;
  isDeepgramReady: boolean;
  pendingChunks: ArrayBuffer[];
}

export interface DeepgramTranscriptData {
  channel?: {
    alternatives?: Array<{
      transcript?: string;
      words?: Array<{
        word: string;
        start: number;
        end: number;
        confidence: number;
        speaker: string;
      }>;
    }>;
  };
  is_final?: boolean;
}
