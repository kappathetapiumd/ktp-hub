import { getCurrentUser } from '@/lib/auth/currentUser';
import { createStrikeTerm, getWeeks } from '@/lib/weeks';

export async function POST(request: Request) {
  const client = await getCurrentUser();

  if (!client || client.role !== 'OWNER')
    return Response.json({ error: 'Unauthorized' });

  const { startDate, endDate } = await request.json();

  const strikeTerm = await createStrikeTerm(startDate, endDate);

  return Response.json(strikeTerm);
}

export async function GET() {
  const client = await getCurrentUser();

  if (!client || client.role === 'NONE')
    return Response.json({ error: 'Unauthorized' });
  
  const weeks = await getWeeks();

  return Response.json(weeks);
}
