import { cookies } from 'next/headers';

import { addUser, getUser } from '@/lib/auth/auth';
import { generateSalt, hashPassword } from '@/lib/auth/passwordHasher';
import { createUserSession } from '@/lib/auth/session';
import { Prisma } from '@/generated/prisma/client';

export async function POST(request: Request) {
  const { email, name, password } = await request.json();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await getUser(normalizedEmail);

  if (existingUser)
    return Response.json({ error: 'User already exists.' });

  const salt = generateSalt();
  const hashedPassword = await hashPassword(password, salt);

  let user;

  try {
    user = await addUser(normalizedEmail, name, hashedPassword, salt);
  } catch (error) {
    // The unique email constraint closes the race between the check and create.
    if (error instanceof Prisma.PrismaClientKnownRequestError
      && error.code === 'P2002')
      return Response.json({ error: 'User already exists.' });

    throw error;
  }

  await createUserSession(user, await cookies());

  return Response.json({ success: true, role: user.role });
}
