import RequirementDashboard from './RequirementDashboard';

import type { Metadata } from 'next';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export const metadata: Metadata = {
  title: "KTP Hub — Requirements",
  description: "A hub for Kappa Theta Pi @ UMD",
};

export default async function Page() {
  const user = await convertToUser((await getCurrentUser())!);

  return <RequirementDashboard user={user} />
}
