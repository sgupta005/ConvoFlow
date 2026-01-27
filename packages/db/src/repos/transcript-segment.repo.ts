import { prisma } from '../client';

export async function getTranscriptSegmentsByMeeting(meetingId: string, afterTimestamp?: Date) {
  return await prisma.transcriptSegment.findMany({
    where: {
      meetingId,
      ...(afterTimestamp ? { createdAt: { gt: afterTimestamp } } : {}),
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

export async function createTranscriptSegment(data: {
  meetingId: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
  speaker?: string;
}) {
  return await prisma.transcriptSegment.create({
    data,
  });
}
