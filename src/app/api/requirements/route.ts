import { clearRequirements, getRequirementUsers, updateRequirement } from '@/lib/requirements';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const type = searchParams.get('type');

  const users = await getRequirementUsers(type!);
  return Response.json(users);
}

export async function PUT(request: Request) {
  const { id, completed, event } = await request.json();

  await updateRequirement(id, completed, event)
  return Response.json({ success: true });
}

export async function DELETE() {
  await clearRequirements();
  
  return Response.json({ success: true });
}
