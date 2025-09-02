import { getRedisDup } from '../client';
import { keys } from '../keys';
import { STREAMS } from '../config';
import { TranscriptChunk } from '@workspace/contracts';

export async function appendTranscriptChunk(chunk: TranscriptChunk) {
  const client = await getRedisDup();
  try {
    const streamKey = keys.stream.transcripts(chunk.meetingId);
    return await client.xAdd(
      streamKey,
      '*',
      {
        meetingId: chunk.meetingId,
        speaker: chunk.speaker ?? '',
        text: chunk.text,
        ts: String(chunk.ts) ?? '',
        lang: chunk.lang ?? '',
      },
      {
        TRIM: {
          strategy: 'MAXLEN',
          strategyModifier: '~',
          threshold: STREAMS.transcriptsMaxLen,
        },
      }
    );
  } finally {
    await client.quit();
  }
}

// Ensure consumer group exists (create if not)
export async function ensureTranscriptGroup(meetingId: string) {
  const client = await getRedisDup();
  const streamKey = keys.stream.transcripts(meetingId);
  const group = keys.group.transcripts(meetingId);
  try {
    // create stream with a dummy entry if not exists
    try {
      await client.xGroupCreate(streamKey, group, '$', {
        MKSTREAM: true,
      });
    } catch (e: any) {
      if (!String(e?.message ?? '').includes('BUSYGROUP')) throw e;
    }
  } finally {
    await client.quit();
  }
}

// Blocking read from group
export async function readTranscriptBatch(opts: {
  meetingId: string;
  consumerName: string;
  count?: number;
  blockMs?: number;
}) {
  const client = await getRedisDup();
  const streamKey = keys.stream.transcripts(opts.meetingId);
  const group = keys.group.transcripts(opts.meetingId);

  const count = opts.count ?? STREAMS.batchCount;
  const blockMs = opts.blockMs ?? STREAMS.blockMs;

  try {
    const res = await client.xReadGroup(
      group,
      opts.consumerName,
      {
        key: streamKey,
        id: '>',
      },
      {
        COUNT: count,
        BLOCK: blockMs,
      }
    );
    // Normalize response
    if (!res) return [];
    const streamData = (res as any)[streamKey];
    if (!streamData || !streamData.messages) return [];

    return streamData.messages.map((entry: any) => {
      const obj = entry.message;
      return {
        id: entry.id,
        speaker: obj['speaker'],
        text: obj['text'],
        ts: Number(obj['ts'] ?? Date.now()),
        lang: obj['lang'] || undefined,
      };
    });
  } finally {
    await client.quit();
  }
}

export async function ackTranscript(meetingId: string, ids: string[]) {
  if (!ids.length) return 0;
  const client = await getRedisDup();
  try {
    return await client.xAck(
      keys.stream.transcripts(meetingId),
      keys.group.transcripts(meetingId),
      ids
    );
  } finally {
    await client.quit();
  }
}
