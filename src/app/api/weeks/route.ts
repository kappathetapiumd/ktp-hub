import { createStrikeTerm, getWeeks } from '@/lib/weeks';

export async function POST(request: Request) {
  const { startDate, endDate } = await request.json();

  await createStrikeTerm(startDate, endDate);

  return Response.json({ success: true });
}

export async function GET() {
  const weeks = await getWeeks();

  return Response.json(weeks);
}
