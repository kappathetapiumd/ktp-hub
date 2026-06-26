import prisma from './prisma';

import { sortUsers } from './utils';
import { Role } from '@/generated/prisma/enums';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  membershipCommittee: boolean;
}

export async function getUsers(isActive: boolean) {
  const users = await prisma.user.findMany({
    where: { isActive },
    omit: {
      hashedPassword: true,
      salt: true,
      isActive: true,
    }
  });
  
  return sortUsers(users);
}  

export async function filterUsers(search: string, isActive: boolean) {
  const query = search.trim();

  const roleMatches = Object.values(Role).filter(role =>
    (role !== 'PCP_PCVP' ? role.toLowerCase() : 'pcp/pcvp')
      .includes(query.toLowerCase())
  );

  const isMembershipSearch = ['membership', 'committee', 'mc']
    .some(word => word.includes(query.toLowerCase()));

  const filteredUsers = await prisma.user.findMany({
    where: {
      isActive,
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          ...(roleMatches.length > 0
            ? [{ role: { in: roleMatches } }]
            : []),
          ...(isMembershipSearch
            ? [{ membershipCommittee: true }]
            : []),
        ],
      }),
    },
    omit: {
      hashedPassword: true,
      salt: true,
      isActive: true
    }
  });

  return sortUsers(filteredUsers);
}

export async function updateMembership(
  id: string, membershipCommittee: boolean
) {
  await prisma.$transaction(async (tx) => {
    await tx.user.updateMany({
        where: { id },
        data: { membershipCommittee },
    });

    // update sessions
    await tx.session.updateMany({
      where: { userId: id },
      data: { membershipCommittee }
    });
  });
}  

export async function setUserInactive(id: string) {
  await prisma.$transaction(async (tx) => {
    await tx.user.updateMany({
      where: { id },
      data: { isActive: false },
    });

    // delete sessions
    await tx.session.deleteMany({
      where: { userId: id }
    });
  });
}  

export async function updateUser(
  id: string, name: string, email: string, role: Role
) {
  const membershipCommittee = role === 'ADMIN';

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        membershipCommittee
      },
      select: { membershipCommittee: true }
    });

    // update sessions
    await tx.session.updateMany({
      where: { userId: id },
      data: { 
        role,
        membershipCommittee
      }
    });

    return updatedUser;
  });

  return updatedUser;
}  

export async function deleteInactiveUser(id: string) {
  await prisma.$transaction(async (tx) => {
    await tx.strikeEvent.deleteMany({
      where: {
        'OR': [
          { pledgeId: id },
          { createdById: id }
        ]
      }
    });

    await tx.user.deleteMany({
      where: { id }
    });
  })
}

export async function setUserActive(id: string) {
  await prisma.user.updateMany({
    where: { id },
    data: { isActive: true }
  });
}

export async function deleteAllInactiveUsers() {
  await prisma.$transaction(async (tx) => {
    const inactiveUsers = await tx.user.findMany({
      where: { isActive: false },
      select: { id: true }
    });

    for (const user of inactiveUsers) {
      await tx.strikeEvent.deleteMany({
        where: {
          OR: [
            { pledgeId: user.id },
            { createdById: user.id }
          ]
        }
      });

      await tx.user.deleteMany({
        where: { id: user.id }
      });
    }
  });
}
