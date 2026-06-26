import { getCurrentUser } from '@/lib/auth/currentUser';
import { getPledges } from '@/lib/pledges';

export async function GET() {
  // const client = await getCurrentUser();

  // if (!client || client.role === 'NONE')
  //   return Response.json({ error: 'Unauthorized' });

  const pledges = await getPledges();

  return Response.json(pledges);
}
