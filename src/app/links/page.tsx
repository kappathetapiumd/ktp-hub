import LinkDashboard from './LinkDashboard';
import AppNavigation from '@/components/navigation/AppNavigation';

import type { Metadata } from 'next';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export const metadata: Metadata = {
  title: "KTP Hub — Links",
  description: "A hub for Kappa Theta Pi @ UMD",
};

export default async function Page() {
  const user = await convertToUser((await getCurrentUser())!);

  return <>
    <LinkDashboard user={user} />
    <AppNavigation user={user} />
  </>
}
