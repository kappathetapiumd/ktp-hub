import RequirementDashboard from './RequirementDashboard';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export default async function Page() {
  const user = await convertToUser((await getCurrentUser())!);

  return <RequirementDashboard user={user} />
}
