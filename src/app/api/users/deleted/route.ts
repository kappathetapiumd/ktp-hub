import { deleteAllInactiveUsers, deleteInactiveUser, filterUsers, getUsers, setUserActive } from '@/lib/users';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search');
  const isActive = false;

  // load original users or no search filter
  if (!search) {
    const users = await getUsers(isActive);
    return Response.json(users);
  }

  const filteredUsers = await filterUsers(search, isActive);
  return Response.json(filteredUsers);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get('userId');
  const deleteAll = searchParams.get('deleteAll')

  if (deleteAll === 'false') {
    if (!userId) return;

    const deletedUser = await deleteInactiveUser(userId);
    return Response.json(deletedUser);
  }

  const deletedUsers = await deleteAllInactiveUsers();
  return Response.json(deletedUsers);
}

export async function PUT(request: Request) {
  const { userId } = await request.json();

  const activeUser = await setUserActive(userId);

  return Response.json(activeUser);
}
