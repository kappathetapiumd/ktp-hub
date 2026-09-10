import { createStrikeTerm, getWeeks } from '@/lib/weeks';

export async function POST(request: Request) {
  const { startDate, endDate } = await request.json();

  try {
    await createStrikeTerm(startDate, endDate);
  } catch (error) {
    if (error instanceof RangeError)
      return Response.json({ error: error.message }, { status: 400 });

    throw error;
  }

  return Response.json({ success: true });
}

export async function GET() {
  const weeks = await getWeeks();

  return Response.json(weeks);
}
