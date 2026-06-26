import { filterUsers, getUsers, setUserInactive, updateMembership, updateUser } from '@/lib/users';
import { getCurrentUser } from '@/lib/auth/currentUser';

import type { Role } from '@/generated/prisma/enums';

export async function GET(request: Request) {
  const client = await getCurrentUser();

  if (!client || !(client.role === 'OWNER' || client.role === 'ADMIN'))
    return Response.json({ error: 'Unauthorized' });

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
  const client = await getCurrentUser();

  if (!client || !(client.role === 'OWNER' || client.role === 'ADMIN'))
    return Response.json({ error: 'Unauthorized' });

  const { id, name, email, role, membershipCommittee } = await request.json();

  // clicking checkbox
  if (membershipCommittee !== undefined) {
    await updateMembership(id, membershipCommittee);
    return Response.json({ success: true });
  }

  // updating user
  const updatedUser = await updateUser(id, name, email, role as Role);
  return Response.json(updatedUser);
}

export async function DELETE(request: Request) {
  const client = await getCurrentUser();

  if (!client || !(client.role === 'OWNER' || client.role === 'ADMIN'))
    return Response.json({ error: 'Unauthorized' });
    
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get('userId');

  if (!userId) return;

  await setUserInactive(userId);

  return Response.json({ success: true });
}
