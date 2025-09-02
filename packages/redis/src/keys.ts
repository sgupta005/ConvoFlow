import { APP_PREFIX } from './config';

export const keys = {
  queue: {
    botSpawns: `bot spawns`,
  },
  queueEvents: {
    botSpawns: `bot spawns events`,
  },
  stream: {
    transcripts: (meetingId: string) =>
      `${APP_PREFIX}:stream:transcripts:${meetingId}`,
  },
  group: {
    transcripts: (meetingId: string) =>
      `${APP_PREFIX}:cg:transcripts:${meetingId}`,
  },
};
