import { Prisma } from 'generated/prisma/client';
import { prisma } from '../client';

export async function createMeeting(data: Prisma.MeetingCreateInput) {
  const meeting = await prisma.meeting.create({
    data,
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
