import StrikeDashboard from './StrikeDashboard';

import { convertToUser, getCurrentUser } from '@/lib/auth/currentUser';

export default async function Page() {
  const user = await convertToUser((await getCurrentUser())!);

  return <StrikeDashboard user={user} />
}
