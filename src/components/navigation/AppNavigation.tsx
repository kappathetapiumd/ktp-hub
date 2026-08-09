'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { CurrentUser } from '@/lib/auth/currentUser';
import { getAppRoutes } from './appRoutes';

import styles from './AppNavigation.module.css';

type Props = {
  user: CurrentUser;
  className?: string;
  hidden?: boolean;
};

export default function AppNavigation({ user, className = '', hidden = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navigationRef = useRef<HTMLElement>(null);
  const routes = getAppRoutes(user);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (isOpen && !navigationRef.current?.contains(event.target as Node))
        setIsOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navigationRef}
      className={`${styles.navigation} ${className}`}
      aria-label="Page navigation"
      hidden={hidden}
    >
      <div id="app-navigation-menu" className={`${styles.menu} ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen}>
        {routes.map(route => (
          <Link
            key={route.href}
            href={route.href}
            className={`${styles.link} ${pathname === route.href ? styles.active : ''}`}
            tabIndex={isOpen ? 0 : -1}
            aria-current={pathname === route.href ? 'page' : undefined}
            onClick={() => setIsOpen(false)}
          >
            <i className={`fa-solid ${route.icon}`} aria-hidden="true" />
            <span>{route.label}</span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen(open => !open)}
        aria-expanded={isOpen}
        aria-controls="app-navigation-menu"
        aria-label={isOpen ? 'Close page navigation' : 'Open page navigation'}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-compass'}`} aria-hidden="true" />
        <span>{isOpen ? 'Close' : 'Navigate'}</span>
      </button>
    </nav>
  );
}
