import type { Metadata } from 'next';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';
import HomeDashboard from './HomeDashboard';

export const metadata: Metadata = {
  title: 'KTP Hub — Home',
  description: 'A hub for Kappa Theta Pi @ UMD'
};

export default async function Page() {
  const user = await convertToUser((await getCurrentUser())!);
  return <HomeDashboard user={user} />;
}
