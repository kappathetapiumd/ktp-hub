import { pusherServer } from '@/lib/pusher/server';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { addStrike, deleteStrike, getStrikeHistory, updateStrike } from '@/lib/strikes';

export async function POST(request: Request) {
  const { pledgeId, createdById, amount, reason } = await request.json();

  const newStrikeEvent = await addStrike(pledgeId, createdById, amount, reason);

  await pusherServer.trigger('private-strikes', 'strike-created', {
    pledgeId,
    userId: createdById
  });

  return Response.json(newStrikeEvent);
}

export async function GET(request: Request) {
  const user = (await getCurrentUser())!;

  const { searchParams } = new URL(request.url);

  const pledgeId = searchParams.get('pledgeId');
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  // Require explicit UTC instants so the server timezone cannot shift the week.
  if (!pledgeId || !start?.endsWith('Z') || !end?.endsWith('Z'))
    return Response.json({ error: 'Missing week boundaries.' }, { status: 400 });

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (!Number.isFinite(startDate.getTime()) || !Number.isFinite(endDate.getTime())
    || startDate >= endDate)
    return Response.json({ error: 'Invalid week boundaries.' }, { status: 400 });

  const strikeHistoryInfo = await getStrikeHistory(pledgeId, startDate, endDate);

  if (user.role === 'PLEDGE') {
    return Response.json({
      totalStrikesPerWeek: strikeHistoryInfo.totalStrikesPerWeek
    });
  }
  
  return Response.json(strikeHistoryInfo);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const strikeId = searchParams.get('strikeId');
  const pledgeId = searchParams.get('pledgeId');
  const deletedById = searchParams.get('deletedById');

  if (!strikeId) return Response.json({ error: 'No strike id.' });
  if (!pledgeId) return Response.json({ error: 'No pledge id.' });
  if (!deletedById) return Response.json({ error: 'No user id.' });

  const deletedStrike = await deleteStrike(strikeId);

  await pusherServer.trigger('private-strikes', 'strike-deleted', {
    pledgeId,
    userId: deletedById
  });

  return Response.json(deletedStrike);
}

export async function PUT(request: Request) {  
  const { id, amount, reason, pledgeId, updatedById } = await request.json();

  await updateStrike(id, amount, reason);

  await pusherServer.trigger('private-strikes', 'strike-updated', {
    pledgeId,
    userId: updatedById
  });

  return Response.json({ success: true });
}
