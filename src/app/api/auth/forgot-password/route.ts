import { getUser } from '@/lib/auth/auth';
import { addPasswordToken, generateToken, hashToken, sendEmail } from '@/lib/auth/forgotToken';

export async function POST(request: Request) {
  const { email } = await request.json();

  const user = await getUser(email);

  if (!user) return Response.json({ success: 'true' });

  const token = generateToken();
  const tokenHash = hashToken(token);

  await addPasswordToken(tokenHash, user.id);

  await sendEmail(email, token);

  return Response.json({ success: 'true' });
}
