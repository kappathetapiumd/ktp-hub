import { cookies } from 'next/headers';

import { getUser } from '@/lib/auth/auth';
import { comparePassword } from '@/lib/auth/passwordHasher';
import { createUserSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await getUser(email);

  if (!user)
    return Response.json({ error: 'No user exists with that email.' });
  
  if (!user.isActive)
    return Response.json({
      error: `This account has been deactivated.
        Please have the owner reinstate the account.`,
    });

  const isCorrectPassword = await comparePassword(
    password,
    user.hashedPassword,
    user.salt
  );

  if (!isCorrectPassword)
    return Response.json({ error: 'Incorrect password.' });

  await createUserSession(user, await cookies());

  return Response.json({ success: true });
}
