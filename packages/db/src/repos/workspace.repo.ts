import { prisma } from '../client';
import type { CreateWorkspaceSchema } from '@workspace/contracts';
import { WorkspaceRole } from '../../generated/prisma/client';

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

export async function getUserDefaultWorkspace(userId: string) {
  return prisma.workspace.findFirst({
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
  return prisma.workspace.findMany({
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
  return prisma.workspace.findUnique({
    where: {
      id
    }
  })
}

export async function deleteWorkspace(id: string) {
  return prisma.workspace.delete({
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
