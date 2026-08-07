import ForgotPassword from '@/components/login/ForgotPassword';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password — KTP Hub',
  description: 'Request a password reset email for your KTP Hub account.'
};

export default function Page() {
  return <ForgotPassword />;
}
