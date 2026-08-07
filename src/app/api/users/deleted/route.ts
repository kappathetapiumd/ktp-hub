import { deleteAllInactiveUsers, deleteInactiveUser, getUsers, setUserActive } from '@/lib/users';

export async function GET() {
  const notActive = false;

  const users = await getUsers(notActive);

  return Response.json(users);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get('userId');
  const deleteAll = searchParams.get('deleteAll')

  if (deleteAll === 'false') {
    if (!userId) return; Response.json({ error: 'No user id.' });

    await deleteInactiveUser(userId);
    return Response.json({ success: true });
  }

  if (deleteAll === 'true') {
    await deleteAllInactiveUsers();
    return Response.json({ success: true });
  }
}

export async function PUT(request: Request) {
  const { userId } = await request.json();

  await setUserActive(userId);

  return Response.json({ success: true });
}
