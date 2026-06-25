import dayjs from 'dayjs';

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

export function invalidStrike(
  reason: string,
  amount: string,
  selectedPledge: string,
  weeks: string[] | undefined
) {
  if (!reason || !/^-?[1-9]\d*$/.test(amount) || !selectedPledge || !weeks)
    return true;

  const today = dayjs();
  const startDate = dayjs(weeks[0].split(' - ')[0]);
  const endDate = dayjs(weeks[weeks.length - 1].split(' - ')[1]);

  return today.isBefore(startDate) || today.isAfter(endDate);
}
