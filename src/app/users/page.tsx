import { redirect } from 'next/navigation';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';
import Dashboard from './Dashboard';

export default async function Page() {
  const client = await getCurrentUser();

  if (!client || client.role === 'NONE')
    redirect('/');

  if (client.role !== 'ADMIN' && client.role !== 'OWNER')
    redirect('/strikes');

  const user = await convertToUser(client);

  return <Dashboard user={user} />
}
