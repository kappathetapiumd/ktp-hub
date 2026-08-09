'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import DeleteModal from '@/components/users/modal/DeleteModal';
import UpdateModal from '@/components/users/modal/UpdateModal';
import WeekModal from '@/components/users/modal/WeekModal';
import OwnerModal from '@/components/users/modal/OwnerModal';
import SearchBar from '@/components/users/SearchBar';
import UserList from '@/components/users/UserList';
import ButtonList from '@/components/users/ButtonList';
import FetchingState from '@/components/loading/FetchingState';

import type { User } from '@/lib/users';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './UserDashboard.module.css';

type Props = {
  user: CurrentUser
}

export default function UserDashboard({ user }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const isActive = true;

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
      try {
        const response = await fetch('/api/users');

        if (!response.ok) return;

        const users = await response.json();

        setUsers(users);
      } finally {
        setIsLoadingUsers(false);
      }
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
              {isLoadingUsers
                ? 'Fetching Members…'
                : `${users.length} ${users.length === 1 ? 'member' : 'members'}`}
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
              search={search}
              setSearch={setSearch}
            />
          </div>
        </div>

        <div className={styles['user-list-container']}>
          {!isLoadingUsers && <div className={styles['list-headers']}>
            <span>Member</span>
            <span>Role</span>
            <span>Membership committee</span>
          </div>}
          {isLoadingUsers ? (
            <FetchingState label="Fetching Members…" />
          ) : filteredUsers.length === 0 && search.trim() ? (
            <div className={styles['no-results']}>
              <i className="fa-solid fa-magnifying-glass" />
              <strong>No Matching Members</strong>
              <span>Try searching for a different name, email, or role.</span>
            </div>
          ) : (
            <UserList
              user={user}
              users={filteredUsers}
              setUserId={setUserId}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              setShowDeleteModal={setShowDeleteModal}
              setShowUpdateModal={setShowUpdateModal}
              setUsers={setUsers}
            />
          )}
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

      <Link
        href="/strikes"
        className={styles['dashboard-btn']}
      >
        <i className="fa-solid fa-user-xmark"></i>
        <span>Strike Dashboard</span>
      </Link>
    </main>
  );
}
