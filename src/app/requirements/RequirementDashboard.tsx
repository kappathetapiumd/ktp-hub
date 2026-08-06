'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import UserList from '@/components/requirements/UserList';
import ClearModal from '@/components/requirements/modal/ClearModal';

import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './RequirementDashboard.module.css'

type Props = {
  user: CurrentUser;
}

type User = {
  id: string;
  name: string;
  role: string;
  philSmallEvent: boolean;
  philBigEvent: boolean;
  profDevEventA: boolean;
  profDevEventB: boolean
}

export default function RequirementDashboard({ user }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showClearModal, setShowClearModal] = useState(false);
  
  useEffect(() => {
    loadUsers();

    async function loadUsers() {
      const type =
        (user.role === 'OWNER' || user.role === 'ADMIN')
        ? 'all'
        : user.role === 'BROTHER'
        ? 'brothers'
        : 'pledges';

      const params = new URLSearchParams({
        type
      });

      const response = await fetch(`/api/requirements?${params.toString()}`);

      if (!response.ok) return;

      const users = await response.json();
      setUsers(users);
    }
  }, [user.role]);

  return (
    <>
      {showClearModal &&
        <ClearModal
          setUsers={setUsers}
          showModal={setShowClearModal}
        />
      }

      {(user.role === 'ADMIN' || user.role === 'OWNER') &&
        <button
          onClick={() => setShowClearModal(true)}
          className={styles['clear-btn']}
        >
          Clear
        </button>
      }

      <button
        onClick={() => router.push('/strikes')}
        className={styles['strikes-btn']}
        aria-label="Return to strikes"
      >
        <i className="fa-solid fa-user-xmark"></i>
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
          users={users}
          setUsers={setUsers}
        />
      </div>

    </>
  );
}
