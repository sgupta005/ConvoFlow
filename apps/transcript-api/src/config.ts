import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AUDIO_STREAM_CONFIG } from '@workspace/contracts';

export const PORT = AUDIO_STREAM_CONFIG.WEBSOCKET_PORT;
export const TRANSCRIPTS_DIR = join(process.cwd(), 'transcripts');

// Ensure transcripts directory exists
export function ensureTranscriptsDir(): void {
  if (!existsSync(TRANSCRIPTS_DIR)) {
    mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
    console.log(`Created transcripts directory: ${TRANSCRIPTS_DIR}`);
  }
}

// Validate environment variables
export function validateEnv(): string {
  const deepgramApiKey = process.env.DEEPGRAM_API_KEY;
  if (!deepgramApiKey) {
    console.error('DEEPGRAM_API_KEY environment variable is required');
    process.exit(1);
  }
  return deepgramApiKey;
}
