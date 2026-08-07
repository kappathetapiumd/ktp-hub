'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import DeleteModal from '@/components/users/modal/DeleteModal';
import ActiveModal from '@/components/users/modal/ActiveModal';
import SearchBar from '@/components/users/SearchBar';
import UserList from '@/components/users/UserList';
import ButtonList from '@/components/users/ButtonList';

import type { User } from '@/lib/users';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from '../UserDashboard.module.css';

type Props = {
  user: CurrentUser
}

export default function InactiveUserDashboard({ user }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const isActive = false;

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) return users;

    return users.filter(currentUser => {
      const role = currentUser.role === 'PCP_PCVP'
        ? 'pcp/pcvp pledge'
        : currentUser.role.toLocaleLowerCase();
      const matchesMembership = currentUser.membershipCommittee
        && ['membership', 'committee', 'mc']
          .some(term => term.includes(query));

      return currentUser.name.toLocaleLowerCase().includes(query)
        || currentUser.email.toLocaleLowerCase().includes(query)
        || role.includes(query)
        || matchesMembership;
    });
  }, [search, users]);

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
    <main className={`${styles['dashboard']} ${styles['deleted-dashboard']}`}>
      <div className={styles['background-glow']}></div>

      {showActiveModal &&
        <ActiveModal
          userId={userId}
          setUsers={setUsers}
          showModal={setShowActiveModal}
        />
      }

      {showDeleteModal &&
        <DeleteModal
          userId={userId}
          setUsers={setUsers}
          showModal={setShowDeleteModal}
          isActive={isActive}
          deleteAll={false}
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

      <div className={styles['panel']}>
        <header className={styles['header']}>
          <div className={`${styles['title-icon']} ${styles['archive-icon']}`}>
            <i className="fa-solid fa-box-archive"></i>
          </div>
          <div className={styles['title-copy']}>
            <p className={styles['eyebrow']}>Member archive</p>
            <h1>Deleted Users</h1>
            <p className={styles['subtitle']}>
              Restore former users or permanently clear archived records.
            </p>
          </div>
          <span className={styles['count']}>
            {users.length} archived
          </span>
        </header>

        <div className={styles['search-bar-container']}>
          {users.length > 0 &&
            <div className={styles['search-shell']}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <SearchBar
                search={search}
                setSearch={setSearch}
              />
            </div>
          }
        </div>

        <div className={styles['user-list-container']}>
          {users.length > 0 &&
            <>
              <div className={styles['list-headers']}>
                <span>Archived member</span>
                <span>Former role</span>
                <span>Membership committee</span>
              </div>
              <UserList
                user={user}
                users={filteredUsers}
                setUserId={setUserId}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
                setShowDeleteModal={setShowDeleteModal}
                setShowUpdateModal={setShowActiveModal}
                setUsers={setUsers}
              />
            </>
          }
        </div>
        
        {users.length === 0 && 
          <div className={styles['info-message']}>
            <span className={styles['empty-icon']}>
              <i className="fa-solid fa-box-open"></i>
            </span>
            <h2>The archive is empty</h2>
            <p>Deleted users will appear here if you need to restore them.</p>
          </div>
        }

        <div className={styles['button-list-container']}>
          <ButtonList
            user={user}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            setShowModal={setShowDeleteAllModal}
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
