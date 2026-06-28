'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DeleteModal from '@/components/users/modal/DeleteModal';
import UpdateModal from '@/components/users/modal/UpdateModal';
import WeekModal from '@/components/users/modal/WeekModal';
import SearchBar from '@/components/users/SearchBar';
import UserList from '@/components/users/UserList';
import ButtonList from '@/components/users/ButtonList';

import type { User } from '@/lib/users';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './Dashboard.module.css';

type Props = {
  user: CurrentUser
}

export default function Dashboard({ user }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const isActive = true;

  useEffect(() => {
    loadUsers();

    async function loadUsers() {
      const response = await fetch('/api/users');

      if (!response.ok) return;

      const users = await response.json();

      setUsers(users);
    }
  }, []);

  return (
    <>
      {showDeleteModal &&
        <DeleteModal
          userId={userId}
          setUsers={setUsers}
          showModal={setShowDeleteModal}
          isActive={isActive}
          deleteAll={false}
        />
      }

      {showUpdateModal &&
        <UpdateModal
          user={user}
          userId={userId}
          users={users}
          setUsers={setUsers}
          showModal={setShowUpdateModal}
        />
      }

      {showWeekModal &&
        <WeekModal
          showModal={setShowWeekModal}
        />
      }

      <div className={styles['users-container']}>
        <div className={styles['search-bar-container']}>
          <SearchBar
            isActive={isActive}
            setUsers={setUsers}
          />

          <button
            onClick={() => router.push('/strikes')}
            className={styles['dashboard-btn']}
          >
            <i className="fa-solid fa-tachograph-digital"></i>
          </button>
        </div>

        <div className={styles['user-list-container']}>
          <UserList
            user={user}
            users={users}
            setUserId={setUserId}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            setShowDeleteModal={setShowDeleteModal}
            setShowUpdateModal={setShowUpdateModal}
            setUsers={setUsers}
          />
        </div>

        <div className={styles['button-list-container']}>
          <ButtonList
            user={user}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            setShowModal={setShowWeekModal}
            isActive={isActive}
          />
        </div>
      </div>
    </>
  );
}
