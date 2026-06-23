import { addStrike, getStrikeHistory } from '@/lib/strikes';

export async function POST(request: Request) {
  const { pledgeId, createdById, amount, reason } = await request.json();

  const strike = await addStrike(pledgeId, createdById, amount, reason);

  return Response.json(strike);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pledgeId = searchParams.get('pledgeId');
  const week = searchParams.get('week');

  if (!pledgeId || !week) return;

  const strikeHistory = await getStrikeHistory(pledgeId, week);
  
  return Response.json(strikeHistory);
}
