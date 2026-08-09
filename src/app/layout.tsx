import { Suspense } from 'react';
import { Outfit } from 'next/font/google';

import Head from './head';
import Footer from '@/components/footer/Footer';
import NavigationProgress from '@/components/navigation/NavigationProgress';

import type { Metadata, Viewport } from 'next';

import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "KTP Hub",
  description: "A hub for Kappa Theta Pi @ UMD",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <html
        lang="en"
        className={outfit.variable}
        data-scroll-behavior="smooth"
        suppressHydrationWarning
      >
        <Head />
        <body suppressHydrationWarning>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          {children}
          <Footer />
        </body>
      </html>
    </>
  );
}
