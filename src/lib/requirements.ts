import prisma from './prisma';

import { sortUsers } from './utils';

export async function getRequirementUsers(type: string) {
  let users;

  if (type === 'all') {
    users = await prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { role: 'BROTHER' },
          { role: 'PCP_PCVP' },
          { role: 'PLEDGE' }
        ]
      },
      omit: {
        email: true,
        hashedPassword: true,
        salt: true,
        membershipCommittee: true,
        isActive: true,
      }
    });
  }

  if (type === 'brothers') {
    users = await prisma.user.findMany({
      where: {
        isActive: true,
        role: 'BROTHER'
      },
      omit: {
        email: true,
        hashedPassword: true,
        salt: true,
        membershipCommittee: true,
        isActive: true,
      }
    });
  }

  if (type === 'pledges') {
    users = await prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { role: 'PCP_PCVP' },
          { role: 'PLEDGE' }
        ]
      },
      omit: {
        email: true,
        hashedPassword: true,
        salt: true,
        membershipCommittee: true,
        isActive: true,
      }
    });
  }

  return sortUsers(users!);
}

export async function updateRequirement(
  id: string, completed: boolean, event: string
) {
  if (event === 'SMALL') {
    await prisma.user.updateMany({
      where: { id },
      data: {
        philSmallEvent: completed
      }
    });
  }

  if (event === 'BIG') {
    await prisma.user.updateMany({
      where: { id },
      data: {
        philBigEvent: completed
      }
    });
  }

  if (event === 'A') {
    await prisma.user.updateMany({
      where: { id },
      data: {
        profDevEventA: completed
      }
    });
  }

  if (event === 'B') {
    await prisma.user.updateMany({
      where: { id },
      data: {
        profDevEventB: completed
      }
    });
  }
}

export async function clearRequirements() {
  await prisma.user.updateMany({
    data: {
      philSmallEvent: false,
      philBigEvent: false,
      profDevEventA: false,
      profDevEventB: false
    }
  });
}

export async function getGroupTasks() {
  const groupTasks = await prisma.groupTask.findMany({
    orderBy: { name: 'asc' }
  });

  return groupTasks;
}

export async function createGroupTask(req: string) {
  const newGroupTask = await prisma.groupTask.create({
    data: { name: req }
  });

  return newGroupTask;
}

export async function toggleGroupTask(id: string, completed: boolean) {
  await prisma.groupTask.updateMany({
    where: { id },
    data: { completed }
  });
}

export async function deleteGroupReq(id: string) {
  await prisma.groupTask.deleteMany({
    where: { id }
  });
}
