import ResetPassword from '@/components/login/ResetPassword';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password — KTP Hub',
  description: 'Choose a new password for your KTP Hub account.'
};

export default function Page() {
  return <ResetPassword />;
}
