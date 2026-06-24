import { getUsers } from '@/lib/users';

export async function GET() {
  const users = await getUsers();

  return Response.json(users);
}
