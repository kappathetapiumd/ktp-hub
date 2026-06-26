import { getCurrentUser } from '@/lib/auth/currentUser';
import { addStrike, deleteStrike, getStrikeHistory, updateStrike } from '@/lib/strikes';

export async function POST(request: Request) {
  const client = await getCurrentUser();

  if (!client || !client.membershipCommittee)
    return Response.json({ error: 'Unauthorized' });

  const { pledgeId, createdById, amount, reason } = await request.json();

  const newStrikeEvent = await addStrike(pledgeId, createdById, amount, reason);

  return Response.json(newStrikeEvent);
}

export async function GET(request: Request) {
  const client = await getCurrentUser();

  if (!client || client.role === 'NONE' || client.role === 'PLEDGE')
    return Response.json({ error: 'Unauthorized' });
  
  const { searchParams } = new URL(request.url);

  const pledgeId = searchParams.get('pledgeId');
  const week = searchParams.get('week');

  if (!pledgeId || !week) return Response.json([]);

  const strikeHistory = await getStrikeHistory(pledgeId, week);
  
  return Response.json(strikeHistory);
}

export async function DELETE(request: Request) {
  const client = await getCurrentUser();

  if (!client || !client.membershipCommittee)
    return Response.json({ error: 'Unauthorized' });

  const { searchParams } = new URL(request.url);

  const strikeId = searchParams.get('strikeId');

  if (!strikeId) return;

  await deleteStrike(strikeId);

  return Response.json({ success: true });
}

export async function PUT(request: Request) {
  const client = await getCurrentUser();

  if (!client || !client.membershipCommittee)
    return Response.json({ error: 'Unauthorized' });
  
  const { id, amount, reason } = await request.json();

  await updateStrike(id, amount, reason);

  return Response.json({ success: true });
}
