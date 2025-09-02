import dotenv from 'dotenv';
dotenv.config();

export const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const APP_PREFIX = process.env.APP_PREFIX ?? 'convoflow';

export const BULL = {
  concurrency: Number(process.env.BOT_WORKER_CONCURRENCY ?? 4),
  attempts: Number(process.env.BOT_SPAWN_ATTEMPTS ?? 3),
  backoffMs: Number(process.env.BOT_SPAWN_BACKOFF_MS ?? 5_000),
};

export const STREAMS = {
  transcriptsMaxLen: Number(process.env.TRANSCRIPTS_MAXLEN ?? 10_000), // approx
  blockMs: Number(process.env.TRANSCRIPTS_BLOCK_MS ?? 5_000), // XREADGROUP block
  batchCount: Number(process.env.TRANSCRIPTS_BATCH ?? 50),
};
