'use client';

import { useRouter } from 'next/navigation';

import UserList from '@/components/requirements/UserList';

import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './RequirementDashboard.module.css'

type Props = {
  user: CurrentUser;
}

export default function RequirementDashboard({ user }: Props) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.push('/strikes')}
        className={styles['strikes-btn']}
        aria-label="Return to strikes"
      >
        <i className="fa-solid fa-user-xmark"></i>
      </button>

      <button
        className={styles['clear-btn']}
      >
        Clear
      </button>

      <div className={styles['user-list']}>
        <div className={styles['headers']}>
          <span className={styles['header']}>Name</span>
          <span className={styles['header']}>
            <span>Small Event</span>
            <span className={styles['header-detail']}>(Philanthropy)</span>
          </span>
          <span className={styles['header']}>
            <span>Big Event</span>
            <span className={styles['header-detail']}>(Philanthropy)</span>
          </span>
          <span className={styles['header']}>
            <span>Event #1</span>
            <span className={styles['header-detail']}>
              (Professional Development)
            </span>
          </span>
          <span className={styles['header']}>
            <span>Event #2</span>
            <span className={styles['header-detail']}>
              (Professional Development)
            </span>
          </span>
        </div>

        <UserList
          user={user}
        />
      </div>

    </>
  );
}
