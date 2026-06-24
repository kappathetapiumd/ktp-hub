'use client';

import { useEffect, useState } from 'react';
import UserList from '@/components/users/UserList';
import ButtonList from '@/components/users/ButtonList';
import styles from './page.module.css';
import type { User } from '@/lib/users';
import { DeleteModal, UpdateModal } from '@/components/users/Modal';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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

      <div className={styles['users-container']}>
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
          />
        </div>
      </div>
    </>
  );
}
