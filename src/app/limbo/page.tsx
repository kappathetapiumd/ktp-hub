import Limbo from './Limbo';

import type { Metadata } from 'next';

type Props = {
  searchParams: Promise<{ message?: string }>;
}

export const metadata: Metadata = {
  title: "KTP Hub — Limbo",
  description: "A hub for Kappa Theta Pi @ UMD",
};

export default async function Page({ searchParams }: Props) {
  const { message } = await searchParams;

  return <Limbo message={message} />
}
