import { Prisma, WorkspaceRole } from '../../generated/prisma/client';
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

export async function checkUserOwnsMeeting(meetingId: string, userId: string) {
  const meeting = await prisma.meeting.findFirst({
    where: {
      id: meetingId,
      workspace: {
        members: {
          some: {
            userId,
            role: WorkspaceRole.OWNER
          }
        }
      }
    }
  })
  return !!meeting;
}

export async function deleteMeeting(meetingId: string) {
  return prisma.meeting.delete({
    where: { id: meetingId }
  })
}
