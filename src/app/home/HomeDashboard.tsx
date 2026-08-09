import Link from 'next/link';

import type { CurrentUser } from '@/lib/auth/currentUser';
import { getAppRoutes } from '@/components/navigation/appRoutes';

import styles from './HomeDashboard.module.css';

export default function HomeDashboard({ user }: { user: CurrentUser }) {
  const routes = getAppRoutes(user).filter(route => route.href !== '/home');

  return (
    <main className={styles.home}>
      <div className={styles.glow} />
      <section className={styles.content}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.mark}>Κ Θ Π</span>
            <span className={styles.badge}>KTP Hub</span>
          </div>
          <p className={styles.eyebrow}>Chapter workspace</p>
          <h1>Everything you need,<br /><span>all in one place.</span></h1>
          <p className={styles.intro}>
            Jump back into chapter operations with the tools available to your role.
          </p>
        </header>

        <div className={styles.grid}>
          {routes.map((route, index) => (
            <Link
              key={route.href}
              href={route.href}
              className={`${styles.card} ${styles[route.accent]}`}
            >
              <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.icon}><i className={`fa-solid ${route.icon}`} /></span>
              <span className={styles.copy}>
                <strong>{route.label}</strong>
                <small>{route.description}</small>
              </span>
              <i className={`fa-solid fa-arrow-right ${styles.arrow}`} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
