import { prisma } from '../client';
import type { CreateMeetingSchema } from '@workspace/contracts';

export async function createMeeting(data: CreateMeetingSchema) {
  const meeting = await prisma.meeting.create({
    data: {
      title: data.name,
      workspaceId: data.workspaceId,
    },
  });
  return meeting;
}

export function getMeetingById(id: string) {
  return prisma.meeting.findUnique({
    where: { id },
    include: {
      workspace: true,
    },
  });
}

export function getMeetingsByWorkspace(workspaceId: string) {
  return prisma.meeting.findMany({
    where: { workspaceId },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
