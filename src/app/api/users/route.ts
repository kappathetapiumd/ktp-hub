import { deleteUser, filterUsers, getUsers, updateMembership, updateUser } from '@/lib/users';
import { Role } from '@/generated/prisma/enums';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search');

  // load original users or no search filter
  if (!search) {
    const users = await getUsers();
    return Response.json(users);
  }

  const filteredUsers = await filterUsers(search);
  return Response.json(filteredUsers);
}

export async function PUT(request: Request) {
  const { id, name, email, role, membershipCommittee } = await request.json();

  // clicking checkbox
  if (membershipCommittee !== undefined) {
    const updatedUser = await updateMembership(id, membershipCommittee);
    return Response.json(updatedUser);
  }

  // updating user
  const updatedUser = await updateUser(id, name, email, role as Role);
  return Response.json(updatedUser);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get('userId');

  if (!userId) return;

  const deletedUser = await deleteUser(userId);

  return Response.json(deletedUser);
}
