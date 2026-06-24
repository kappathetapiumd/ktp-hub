'use client';

import { useEffect, useState } from 'react';
import UserList from '@/components/users/UserList';
import ButtonList from '@/components/users/ButtonList';
import styles from './page.module.css';
import type { User } from '@/lib/users';
import { DeleteModal, UpdateModal, WeekModal } from '@/components/users/Modal';
import SearchBar from '@/components/users/SearchBar';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);

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
        />
      }

      {showUpdateModal &&
        <UpdateModal
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
            users={users}
            setUsers={setUsers}
          />
        </div>

        <div className={styles['user-list-container']}>
          <UserList
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
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            setShowWeekModal={setShowWeekModal}
          />
        </div>
      </div>
    </>
  );
}
