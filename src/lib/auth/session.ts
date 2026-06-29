import prisma from '../prisma';

import crypto from 'crypto';

import type { Role } from '@/generated/prisma/enums';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { NextRequest } from 'next/server';

export type UserSession = {
  id: string;
  role: Role;
  membershipCommittee: boolean;
}

const COOKIE_SESSION_KEY = 'ktpumd-strike-sheet-session-id';

export async function createUserSession(user: UserSession, cookies: ReadonlyRequestCookies) {
  const sessionId = crypto.randomBytes(64).toString('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await addSession(sessionId, user, expiresAt);

  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    httpOnly: true,
    secure: false, // has to be true for production
    sameSite: 'lax',
    expires: expiresAt,
    path: '/'
  });
}

async function addSession(
  sessionId: string, user: UserSession, expiresAt: Date
) {
  await prisma.session.create({
    data: {
      sessionId,
      userId: user.id,
      role: user.role,
      membershipCommittee: user.membershipCommittee,
      expiresAt
    }
  });
}

export function getUserFromSession(
  cookies: ReadonlyRequestCookies | NextRequest['cookies']
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;

  if (!sessionId) return null;

  return getUserSessionById(sessionId);
}

async function getUserSessionById(sessionId: string) {
  await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  });

  const user = await prisma.session.findFirst({
    where: { sessionId },
    select: {
      userId: true,
      role: true,
      membershipCommittee: true
    }
  });

  return user;
}
