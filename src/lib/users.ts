import prisma from './prisma';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  membershipCommittee: boolean;
}

export async function getUsers() {
  const users = await prisma.user.findMany();

  const roleOrder: Record<string, number> = {
    'OWNER': 1,
    'ADMIN': 2,
    'BROTHER': 3,
    'PCP_PCVP': 4,
    'PLEDGE': 5,
    'NONE': 6
  }

  users.sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);

  return users;
}
