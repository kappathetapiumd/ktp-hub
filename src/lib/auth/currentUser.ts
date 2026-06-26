'use server';

import { cache } from 'react';
import { cookies } from 'next/headers';

import { getUserFromSession } from './session';

import type { Role } from '@/generated/prisma/enums';

export type CurrentUser = {
  id: string;
  role: string;
  membershipCommittee: boolean;
}

export const getCurrentUser = cache(async () => {
  return await getUserFromSession(await cookies());
});

export async function convertToUser(client: {
  userId: string;
  role: Role;
  membershipCommittee: boolean;
}) {
  return {
    id: client.userId,
    role: client.role as string,
    membershipCommittee: client.membershipCommittee,
  };
}
