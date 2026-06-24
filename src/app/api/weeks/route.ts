import { createStrikeTerm, getWeeks } from '@/lib/weeks';

export async function POST(request: Request) {
  const { startDate, endDate } = await request.json();

  const strikeTerm = await createStrikeTerm(startDate, endDate);

  return Response.json(strikeTerm);
}

export async function GET() {
  const weeks = await getWeeks();

  return Response.json(weeks);
}
