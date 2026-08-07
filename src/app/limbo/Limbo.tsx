'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import styles from './Limbo.module.css';

export default function Limbo({ message }: { message: string | undefined }) {
  const router = useRouter();

  useEffect(() => {
    if (!message) return;

    const timeout = setTimeout(() => router.push('/'), 2500);

    return () => clearTimeout(timeout);
  }, [message, router]);

  return (
    <div className={styles['limbo-container']}>
      <section className={styles['limbo-content']}>
        <h1>Κ Θ Π</h1>

        <p className={styles['info-message']}>
          {message
            ? message
            : 'Please wait for the owner or an admin to assign you a role.'
          }
        </p>

        <button
          onClick={() => router.push('/')}
          className={styles['ok-btn']}
        >
          OK
        </button>
      </section>
    </div>
  )
}
