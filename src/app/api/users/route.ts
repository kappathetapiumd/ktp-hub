import { getUsers, setUserInactive, updateMembership, updateUser, transferOwnership } from '@/lib/users';

import type { Role } from '@/generated/prisma/enums';

export async function GET() {
  const isActive = true;

  const users = await getUsers(isActive);

  return Response.json(users);
}

export async function PUT(request: Request) {
  const { id, name, email, role, membershipCommittee, transfer }
    = await request.json();

  // clicking checkbox
  if (membershipCommittee !== undefined) {
    await updateMembership(id, membershipCommittee);
    return Response.json({ success: true });
  }

  // transfering ownership
  if (transfer !== undefined) {
    await transferOwnership(email);
    return Response.json({ success: true });
  }

  // updating user
  const updatedUser = await updateUser(id, name, email, role as Role);
  return Response.json(updatedUser);
}

export async function DELETE(request: Request) {    
  const { searchParams } = new URL(request.url);

  const userId = searchParams.get('userId');

  if (!userId) return Response.json({ error: 'No user id.' });

  await setUserInactive(userId);

  return Response.json({ success: true });
}
