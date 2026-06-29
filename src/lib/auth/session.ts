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

const COOKIE_SESSION_KEY = 'ktpumd-strike-sheet-session-id';

export async function createUserSession(user: UserSession, cookies: ReadonlyRequestCookies) {
  const sessionId = crypto.randomBytes(64).toString('hex');

  const oneDay = 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + 7 * oneDay);

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

export async function updateUserSessionExpiration(
  request: NextRequest, response: NextResponse
) {
  const sessionId = request.cookies.get(COOKIE_SESSION_KEY)?.value;

  if (!sessionId) return;

  const session = await prisma.session.findUnique({
    where: { sessionId }
  });

  if (!session || session.expiresAt <= new Date()) {
    response.cookies.delete(COOKIE_SESSION_KEY);
    return;
  }

  const oneDay = 24 * 60 * 60 * 1000;

  if (session.expiresAt.getTime() - Date.now() < oneDay) {
    const expiresAt = new Date(Date.now() + 7 * oneDay)

    await prisma.session.updateMany({
      where: { sessionId },
      data: { expiresAt }
    });

    response.cookies.set(COOKIE_SESSION_KEY, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    });
  }
}
