import { redirect } from 'next/navigation';

import Dashboard from './Dashboard';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export default async function DeletedUserDashboard() {
  const client = await getCurrentUser();

  if (!client || client.role === 'NONE')
    redirect('/');

  if (client.role !== 'OWNER')
    redirect('/strikes');

  const user = await convertToUser(client);

  return <Dashboard user={user} />
}
