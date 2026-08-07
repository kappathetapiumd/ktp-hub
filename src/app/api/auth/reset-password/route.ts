import { deleteToken, findToken, hashToken, updatePassword } from '@/lib/auth/forgotToken';
import { generateSalt, hashPassword } from '@/lib/auth/passwordHasher';

export async function POST(request: Request) {
  const { token, password } = await request.json();

  const tokenHash = hashToken(token);
  const tokenExists = await findToken(tokenHash);

  if (!tokenExists)
    return Response.json({ error: 'Link is invalid or has expired.' });

  await deleteToken(tokenHash);

  const { userId } = tokenExists;
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);
  await updatePassword(userId, passwordHash, salt);

  return Response.json({ success: true });
}
