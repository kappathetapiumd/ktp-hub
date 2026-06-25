import { filterUsers, getUsers, setUserInactive, updateMembership, updateUser } from '@/lib/users';

import type { Role } from '@/generated/prisma/enums';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search');
  const isActive = true;

  // load original users or no search filter
  if (!search) {
    const users = await getUsers(isActive);
    return Response.json(users);
  }

  const filteredUsers = await filterUsers(search, isActive);
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

  const inactiveUser = await setUserInactive(userId);

  return Response.json(inactiveUser);
}
