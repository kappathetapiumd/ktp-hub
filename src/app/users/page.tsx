import UserDashboard from './UserDashboard';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export default async function Page() {
  const user = await convertToUser((await getCurrentUser())!);

  return <UserDashboard user={user} />
}
