import { prisma } from '../client';
import type { CreateWorkspaceSchema } from '@workspace/contracts';

export async function createWorkspace(data: CreateWorkspaceSchema) {
  const workspace = await prisma.workspace.create({
    data: {
      name: data.name,
      image: data.image ?? null,
      members: {
        create: {
          userId: data.userId,
          role: 'admin',
        },
      },
    },
  });
  return workspace;
}

export function getUserFirstWorkspace(userId: string) {
  return prisma.workspace.findFirst({
    where: {
      members: {
        some: { userId },
      },
    },
  });
}

export function getUserWorkspaces(userId: string) {
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
