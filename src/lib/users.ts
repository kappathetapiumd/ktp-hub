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
    where: { isActive }
  });  
  
  return sortUsers(users);
}  

export async function filterUsers(search: string, isActive: boolean) {
  const query = search.trim();

  const roleMatches = Object.values(Role).filter(role =>
    (role !== 'PCP_PCVP' ? role.toLowerCase() : 'pcp/pcvp').includes(query.toLowerCase())
  );

  const isMembershipSearch = 
    ['membership', 'committee', 'mc'].some(word => word.includes(query.toLowerCase()));

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
  });

  return sortUsers(filteredUsers);
}

export async function updateMembership(id: string, membershipCommittee: boolean) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { membershipCommittee }
  });    
  
  return updatedUser;
}  

export async function setUserInactive(id: string) {
  const inactiveUser = await prisma.user.update({
    where: { id },
    data: { isActive: false }
  });  

  return inactiveUser;
}  

export async function updateUser(id: string, name: string, email: string, role: Role) {
  const membershipCommittee = role.toString() === 'ADMIN'

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,
      membershipCommittee
    }  
  });  

  return updatedUser;
}  

export async function deleteInactiveUser(id: string) {
  const deletedUser = await prisma.$transaction(async (tx) => {
    await tx.strikeEvent.deleteMany({
      where: {
        'OR': [
          { pledgeId: id },
          { createdById: id }
        ]
      }
    });

    const deletedUser = await tx.user.delete({
      where: { id }
    });

    return deletedUser;
  })

  return deletedUser;
}

export async function setUserActive(id: string) {
  const activeUser = await prisma.user.update({
    where: { id },
    data: { isActive: true }
  });

  return activeUser;
}

export async function deleteAllInactiveUsers() {
  const deletedUsers = await prisma.$transaction(async (tx) => {
    const inactiveUsers = await tx.user.findMany({
      where: { isActive: false }
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

      await tx.user.delete({
        where: { id: user.id }
      });
    }

    return inactiveUsers;
  });

  return deletedUsers;
}
