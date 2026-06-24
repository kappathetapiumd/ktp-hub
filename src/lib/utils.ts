import type { User } from './users';

export function sortUsers(users: User[]) {
  const roleOrder: Record<string, number> = {
    'OWNER': 1,
    'ADMIN': 2,
    'BROTHER': 3,
    'PCP_PCVP': 4,
    'PLEDGE': 5,
    'NONE': 6
  }

  users.sort((a, b) => {
    const roleDiff = roleOrder[a.role] - roleOrder[b.role]

    if (roleDiff !== 0) return roleDiff;

    const aLastName = a.name.split(' ')[1];
    const bLastName = b.name.split(' ')[1];

    return aLastName.localeCompare(bLastName);
  });

  return users;
}
