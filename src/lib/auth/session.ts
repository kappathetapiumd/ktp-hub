import prisma from '../prisma';

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import type { Role } from '@/generated/prisma/enums';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export type UserSession = {
  id: string;
  role: Role;
  membershipCommittee: boolean;
}

export const USER_SESSION_HEADER = 'x-ktp-validated-user';

export type ValidatedSession = {
  userId: string;
  role: Role;
  membershipCommittee: boolean;
  expiresAt: Date;
};

const COOKIE_SESSION_KEY = 'session-id';

export async function createUserSession(user: UserSession, cookies: ReadonlyRequestCookies) {
  const sessionId = crypto.randomBytes(64).toString('hex');

  const oneDay = 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + 7 * oneDay);

  // Opportunistic cleanup only during successful sign-in/sign-up.
  await prisma.session.deleteMany({
    where: { expiresAt: { lte: new Date() } }
  });
  await addSession(sessionId, user, expiresAt);

  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
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
  const session = await prisma.session.findUnique({
    where: { sessionId },
    select: {
      expiresAt: true,
      userId: true,
      role: true,
      membershipCommittee: true
    }
  });

  return session && session.expiresAt.getTime() > Date.now() ? session : null;
}

export async function updateUserSessionExpiration(
  request: NextRequest, response: NextResponse, session: ValidatedSession | null
) {
  const sessionId = request.cookies.get(COOKIE_SESSION_KEY)?.value;

  if (!sessionId) return;

  if (!session || session.expiresAt <= new Date()) {
    response.cookies.delete(COOKIE_SESSION_KEY);
    return;
  }

  const oneDay = 24 * 60 * 60 * 1000;

  if (session.expiresAt.getTime() - Date.now() < oneDay) {
    const expiresAt = new Date(Date.now() + 7 * oneDay)

    const renewed = await prisma.session.updateMany({
      where: { sessionId, expiresAt: session.expiresAt },
      data: { expiresAt }
    });

    if (renewed.count === 0) return;

    response.cookies.set(COOKIE_SESSION_KEY, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });
  }
}
