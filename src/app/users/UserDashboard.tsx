'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DeleteModal from '@/components/users/modal/DeleteModal';
import UpdateModal from '@/components/users/modal/UpdateModal';
import WeekModal from '@/components/users/modal/WeekModal';
import OwnerModal from '@/components/users/modal/OwnerModal';
import SearchBar from '@/components/users/SearchBar';
import UserList from '@/components/users/UserList';
import ButtonList from '@/components/users/ButtonList';

import type { User } from '@/lib/users';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './UserDashboard.module.css';

type Props = {
  user: CurrentUser
}

export default function UserDashboard({ user }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
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
    <main className={styles['dashboard']}>
      <div className={styles['background-glow']}></div>

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

      {showOwnerModal &&
        <OwnerModal
          users={users}
          showModal={setShowOwnerModal}
        />
      }

      <div className={styles['panel']}>
        <header className={styles['header']}>
          <div className={styles['title-icon']}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div className={styles['title-copy']}>
            <p className={styles['eyebrow']}>Chapter directory</p>
            <h1>Members</h1>
            <p className={styles['subtitle']}>
              Manage roles, access, and committee membership.
            </p>
          </div>
          <div className={styles['header-actions']}>
            <span className={styles['count']}>
              {users.length} {users.length === 1 ? 'member' : 'members'}
            </span>
            {user.role === 'OWNER' &&
              <button
                onClick={() => setShowOwnerModal(true)}
                className={styles['ownership-btn']}
              >
                <i className="fa-solid fa-crown"></i>
                <span>Transfer ownership</span>
              </button>
            }
          </div>
        </header>

        <div className={styles['search-bar-container']}>
          <div className={styles['search-shell']}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <SearchBar
              isActive={isActive}
              setUsers={setUsers}
            />
          </div>
        </div>

        <div className={styles['user-list-container']}>
          <div className={styles['list-headers']}>
            <span>Member</span>
            <span>Role</span>
            <span>Membership committee</span>
          </div>
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

      <button
        onClick={() => router.push('/strikes')}
        className={styles['dashboard-btn']}
      >
        <i className="fa-solid fa-user-xmark"></i>
        <span>Strike Dashboard</span>
      </button>
    </main>
  );
}
