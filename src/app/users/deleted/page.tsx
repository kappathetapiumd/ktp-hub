import InactiveUserDashboard from './InactiveUserDashboard';

import type { Metadata } from 'next';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export const metadata: Metadata = {
  title: "KTP Hub — Deleted Users",
  description: "A hub for Kappa Theta Pi @ UMD",
};

export default async function DeletedUserDashboard() {
  const user = await convertToUser((await getCurrentUser())!);

  return <InactiveUserDashboard user={user} />
}
