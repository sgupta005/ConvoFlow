import { prisma } from '../client';
import type { CreateWorkspaceSchema } from '@workspace/contracts';
import { Prisma, WorkspaceRole } from '../../generated/prisma/client';

export async function createWorkspace(data: CreateWorkspaceSchema) {
  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      image: data.image ?? null,
      is_default: data.isDefault,
      members: {
        create: {
          userId: data.userId,
          role: WorkspaceRole.OWNER,
        },
      },
    },
  });
  return workspace;
}

export async function updateWorkspace(id: string, data: Prisma.WorkspaceUpdateInput) {
  return await prisma.workspace.update({
    where: {
      id
    },
    data,
  })
}

export async function deleteWorkspace(id: string) {
  return await prisma.workspace.delete({
    where: {
      id
    }
  })
}

export async function getUserDefaultWorkspace(userId: string) {
  return await prisma.workspace.findFirst({
    where: {
      is_default: true,
      members: {
        some: {
          userId,
          role: WorkspaceRole.OWNER
        }
      },
    }
  })
}

export async function getUserWorkspaces(userId: string) {
  return await prisma.workspace.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getWorkspaceById(id: string) {
  return await prisma.workspace.findUnique({
    where: {
      id
    }
  })
}

export async function checkUserOwnsWorkspace(workspaceId: string, userId: string) {
  const workspaceMember = await prisma.workspaceMember.findFirst({
    where:
      { workspaceId, userId, role: WorkspaceRole.OWNER }
  })
  return !!workspaceMember;
}

export async function checkUserHasAccessToWorkspace(workspaceId: string, userId: string) {
  const workspaceMember = await prisma.workspaceMember.findFirst({
    where:
      { workspaceId, userId }
  })
  return !!workspaceMember;
}
