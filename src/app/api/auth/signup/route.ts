import { cookies } from 'next/headers';

import { addUser, getUser } from '@/lib/auth/auth';
import { generateSalt, hashPassword } from '@/lib/auth/passwordHasher';
import { createUserSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  const { email, name, password } = await request.json();

  const existingUser = await getUser(email);

  if (existingUser)
    return Response.json({ error: 'User already exists.', time: 2 });

  const salt = generateSalt();
  const hashedPassword = await hashPassword(password, salt);

  const user = await addUser(email, name, hashedPassword, salt);

  await createUserSession(user, await cookies());

  return Response.json({ success: true });
}
