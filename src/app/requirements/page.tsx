import RequirementDashboard from './RequirementDashboard';
import AppNavigation from '@/components/navigation/AppNavigation';

import type { Metadata } from 'next';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';
import { getRequirements, getRequirementUsers } from '@/lib/requirements';

export const metadata: Metadata = {
  title: "KTP Hub — Requirements",
  description: "A hub for Kappa Theta Pi @ UMD",
};

export default async function Page() {
  const user = await convertToUser((await getCurrentUser())!);
  const type = user.role === 'OWNER' || user.role === 'ADMIN'
    ? 'all'
    : user.role === 'BROTHER'
      ? 'brothers'
      : 'pledges';
  const [users, requirements] = await Promise.all([
    getRequirementUsers(type),
    getRequirements(),
  ]);
  const visibleRequirements = requirements.filter(requirement =>
    type === 'all'
      || requirement.appliesTo === 'ALL'
      || requirement.appliesTo === (type === 'brothers' ? 'BROTHERS' : 'PLEDGES')
  );

  return <>
    <RequirementDashboard
      user={user}
      initialUsers={users}
      initialRequirements={visibleRequirements}
    />
    <AppNavigation user={user} />
  </>
}
