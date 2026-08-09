'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import styles from './NavigationProgress.module.css';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const route = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    const finishTimeout = window.setTimeout(() => setIsNavigating(false), 120);

    return () => window.clearTimeout(finishTimeout);
  }, [route]);

  useEffect(() => {
    const start = () => setIsNavigating(true);
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download'))
        return;

      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      const isSamePage = destination.pathname === current.pathname
        && destination.search === current.search;

      if (destination.origin === current.origin && !isSamePage) start();
    };
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      start();
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      start();
      return originalReplaceState.apply(this, args);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', start);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', start);
    };
  }, []);

  return (
    <div
      className={`
        ${styles['progress']} ${isNavigating ? styles['active'] : ''}
      `}
      role="progressbar"
    >
      <span />
    </div>
  );
}
