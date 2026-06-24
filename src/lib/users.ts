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

export async function getUsers() {
  const users = await prisma.user.findMany({
    where: { isActive: true }
  });

  return sortUsers(users);
}

export async function updateMembership(id: string, membershipCommittee: boolean) {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { membershipCommittee }
  });

  return updatedUser;
}

export async function deleteUser(id: string) {
  const deletedUser = await prisma.user.update({
    where: { id },
    data: { isActive: false }
  });

  return deletedUser;
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

export async function filterUsers(search: string) {
  const query = search.trim();

  const roleMatches = Object.values(Role).filter(role =>
    (role !== 'PCP_PCVP' ? role.toLowerCase() : 'pcp/pcvp').includes(query.toLowerCase())
  );

  const isMembershipSearch =
    ['membership', 'committee'].some(word =>
      query.toLowerCase().includes(word)
    );

  const filteredUsers = await prisma.user.findMany({
    where: {
      isActive: true,
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

  return filteredUsers;
}

// export async function deleteInactiveUsers() {
//   const deletedUser = await prisma.$transaction(async (tx) => {
//     await tx.strikeEvent.deleteMany({
//       where: {
//         'OR': [
//           { pledgeId: id },
//           { createdById: id }
//         ]
//       }
//     });

//     const deletedUser = await tx.user.delete({
//       where: { id }
//     });

//     return deletedUser;
//   })

//   return deletedUser;
// }
