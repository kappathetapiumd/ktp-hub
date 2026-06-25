'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ActiveModal from '@/components/users/modal/ActiveModal';
import SearchBar from '@/components/users/SearchBar';
import UserList from '@/components/users/UserList';
import ButtonList from '@/components/users/ButtonList';
import styles from './page.module.css';
import type { User } from '@/lib/users';
import DeleteModal from '@/components/users/modal/DeleteModal';

export default function DeletedUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const isActive = false;

  useEffect(() => {
    loadUsers();

    async function loadUsers() {
      const response = await fetch('/api/users/deleted');

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

      {showActiveModal &&
        <ActiveModal
          userId={userId}
          setUsers={setUsers}
          showModal={setShowActiveModal}
        />
      }

      {showDeleteAllModal &&
        <DeleteModal
          userId={userId}
          setUsers={setUsers}
          showModal={setShowDeleteAllModal}
          isActive={isActive}
          deleteAll={true}
        />
      }

      {users.length > 0 ?
        <div className={styles['users-container']}>
          <div className={styles['search-bar-container']}>
            <SearchBar
              isActive={isActive}
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
              setShowUpdateModal={setShowActiveModal}
              setUsers={setUsers}
            />
          </div>

          <div className={styles['button-list-container']}>
            <ButtonList
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
              isDeleting={isDeleting}
              setIsDeleting={setIsDeleting}
              setShowModal={setShowDeleteAllModal}
              isActive={isActive}
            />
          </div>
        </div>

        :
        
        <p className={styles['info-message']}>No deleted users.</p>
      }

      <button
        onClick={() => router.push('/users')}
        className={styles['users-btn']}
      >
        <i className="fa-solid fa-users"></i>
      </button>
    </>
  );
}
