import { addStrike, deleteStrike, getStrikeHistory, updateStrike } from '@/lib/strikes';

export async function POST(request: Request) {
  const { pledgeId, createdById, amount, reason } = await request.json();

  const newStrikeEvent = await addStrike(pledgeId, createdById, amount, reason);

  return Response.json(newStrikeEvent);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const pledgeId = searchParams.get('pledgeId');
  const week = searchParams.get('week');

  if (!pledgeId || !week) return;

  const strikeHistory = await getStrikeHistory(pledgeId, week);
  
  return Response.json(strikeHistory);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const strikeId = searchParams.get('strikeId');

  if (!strikeId) return;

  const deletedStrike = await deleteStrike(strikeId);

  return Response.json(deletedStrike);
}

export async function PUT(request: Request) {
  const { id, amount, reason } = await request.json();

  const updatedStrike = await updateStrike(id, amount, reason);

  return Response.json(updatedStrike);
}
