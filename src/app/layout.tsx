import type { Metadata } from 'next';

import Head from './head';
import Footer from '@/components/footer/Footer';

import './globals.css';

export const metadata: Metadata = {
  title: "KTP Hub — Strike",
  description: "A hub for Kappa Theta Pi @ UMD",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
        <Head />
        <body suppressHydrationWarning>{children}</body>
      </html>
      <Footer />
    </>
  );
}
