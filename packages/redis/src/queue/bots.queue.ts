import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import { getRedisConnectionConfig } from '../client';
import { keys } from '../keys';
import { APP_PREFIX, BULL } from '../config';
import { SpawnBotPayload } from '@workspace/contracts';

let _queue: Queue<SpawnBotPayload> | null = null;
let _events: QueueEvents | null = null;

export function getBotQueue(): Queue<SpawnBotPayload> {
  if (_queue) return _queue;
  _queue = new Queue<SpawnBotPayload>(keys.queue.botSpawns, {
    connection: getRedisConnectionConfig(),
    prefix: APP_PREFIX,
  });
  return _queue;
}

export function getBotQueueEvents(): QueueEvents {
  if (_events) return _events;
  _events = new QueueEvents(keys.queue.botSpawns, {
    connection: getRedisConnectionConfig(),
  });
  _events.on('completed', ({ jobId }) =>
    console.log(`[bots] completed ${jobId}`)
  );
  _events.on('failed', ({ jobId, failedReason }) =>
    console.error(`[bots] failed ${jobId}: ${failedReason}`)
  );
  return _events;
}

// Idempotent add: jobId === meetingId
export async function enqueueSpawnBot(payload: SpawnBotPayload) {
  const queue = getBotQueue();
  const opts: JobsOptions = {
    jobId: payload.meetingId,
    attempts: BULL.attempts,
    backoff: { type: 'exponential', delay: BULL.backoffMs },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  };
  return queue.add('spawn', payload, opts);
}

// Worker factory (call this in Bot Manager process)
export function makeBotWorker(
  processor: (payload: SpawnBotPayload) => Promise<void>
): Worker<SpawnBotPayload> {
  return new Worker<SpawnBotPayload>(
    keys.queue.botSpawns,
    async (job) => processor(job.data),
    {
      connection: getRedisConnectionConfig(),
      concurrency: BULL.concurrency,
    }
  );
}
