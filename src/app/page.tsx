import { redirect } from 'next/navigation';

import LoginPage from '@/components/login/LoginPage';

import { getCurrentUser } from '@/lib/auth/currentUser';

export default async function Page() {
  const client  = await getCurrentUser();

  if (client && client.role !== 'NONE')
    redirect('/strikes');

  return <LoginPage />;
}
