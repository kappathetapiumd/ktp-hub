import { redirect } from 'next/navigation';

import Dashboard from './Dashboard';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export default async function Page() {
  const client = await getCurrentUser();

  if (!client || client.role === 'NONE')
    redirect('/');

  const user = await convertToUser(client);

  return <Dashboard user={user} />
}
