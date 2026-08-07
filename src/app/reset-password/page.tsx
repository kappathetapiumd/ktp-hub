import ResetPassword from '@/components/login/ResetPassword';

import type { Metadata } from 'next';

type Props = {
  searchParams: Promise<{ token?: string | string[]; }>;
};

export const metadata: Metadata = {
  title: 'Reset Password — KTP Hub',
  description: 'Choose a new password for your KTP Hub account.'
};

export default async function Page({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <ResetPassword
      token={typeof token === 'string' ? token : undefined}
    />
  );
}
