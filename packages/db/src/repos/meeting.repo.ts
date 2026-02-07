import { Prisma, WorkspaceRole } from '../../generated/prisma/client';
import { prisma } from '../client';

export async function createMeeting(data: Prisma.MeetingCreateInput) {
  const meeting = await prisma.meeting.create({
    data,
  });
  return meeting;
}

export async function updateMeeting(meetingId: string, data: Prisma.MeetingUpdateInput) {
  return await prisma.meeting.update({
    where: { id: meetingId },
    data,
  })
}

export async function deleteMeeting(meetingId: string) {
  return await prisma.meeting.delete({
    where: { id: meetingId }
  })
}

export async function getMeetingById(id: string) {
  return await prisma.meeting.findUnique({
    where: { id },
  });
}

export async function getMeetingByIdWithActionItems(id: string) {
  return await prisma.meeting.findUnique({
    where: { id },
    include: { actionItems: true }
  })
}

export async function getMeetingByIdWithTranscript(id: string) {
  return await prisma.meeting.findUnique({
    where: { id },
    include: {
      transcriptSegments: true,
    },
  });
}

export async function getMeetingsByWorkspace(workspaceId: string) {
  return await prisma.meeting.findMany({
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

export async function checkUserCanUpdateMeeting(meetingId: string, userId: string) {
  const meeting = await prisma.meeting.findFirst({
    where: {
      id: meetingId,
      workspace: {
        members: {
          some: {
            userId,
            role: {
              in: [WorkspaceRole.OWNER, WorkspaceRole.ADMIN]
            }
          }
        }
      }
    }
  })
  return !!meeting;
}

export async function checkUserHasAccessToMeeting(meetingId: string, userId: string) {
  const meeting = await prisma.meeting.findFirst({
    where: {
      id: meetingId,
      workspace: {
        members: {
          some: {
            userId,
          }
        }
      }
    }
  })
  return !!meeting;
}
