'use server';

import { cache } from 'react';
import { headers } from 'next/headers';

import { USER_SESSION_HEADER, type ValidatedSession } from './session';

import type { Role } from '@/generated/prisma/enums';

export type CurrentUser = {
  id: string;
  role: string;
  membershipCommittee: boolean;
}

export const getCurrentUser = cache(async () => {
  // Proxy overwrites this header on every application request. Fail closed
  // rather than starting a second database lookup when identity is absent.
  const identity = (await headers()).get(USER_SESSION_HEADER);
  return identity
    ? JSON.parse(identity) as Omit<ValidatedSession, 'expiresAt'>
    : null;
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
