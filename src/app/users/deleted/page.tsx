import InactiveUserDashboard from './InactiveUserDashboard';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export default async function DeletedUserDashboard() {
  const user = await convertToUser((await getCurrentUser())!);

  return <InactiveUserDashboard user={user} />
}
