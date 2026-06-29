import { useState } from 'react';

import { sortUsers } from '@/lib/utils';

import type { User } from '@/lib/users';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './Modal.module.css';

type Props = {
  user: CurrentUser
  userId: string;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpdateModal(
  { user, userId, users, setUsers, showModal }: Props
) {
  const selectedUser = users.find(user => user.id === userId)!;

  const [name, setName] = useState(selectedUser.name);
  const [email, setEmail] = useState(selectedUser.email);
  const [role, setRole] = useState(selectedUser.role);
  const [showRoleSelect, setShowRowSelect] = useState(false);

  function changeRole(role: string) {
    setRole(role);
    setShowRowSelect(false);
  }

  function closeRowSelect(e: React.KeyboardEvent) {
    if (e.key === 'Escape')
      setShowRowSelect(false);
  }

  async function updateUser() {
    showModal(false);

    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userId,
        name,
        email,
        role
      })
    });

    if (!response.ok) return;

    const { membershipCommittee } = await response.json();

    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, name, email, role, membershipCommittee }
          : user
      )
    );

    setUsers(prev =>
      sortUsers(prev)
    );
  }

  return (
    <div
      onClick={() => showRoleSelect && setShowRowSelect(false)}
      onKeyDown={e => closeRowSelect(e)}
      className={styles['modal-overlay']}
    >
      <div className={styles['modal-container']}>
        <div className={styles['user-content']}>
          <input
            onChange={e => setName(e.target.value)}
            value={name}
            placeholder='Full Name'
            className={styles['name']}
          />
          <input
            onChange={e => setEmail(e.target.value)}
            value={email}
            placeholder='Email'
            className={styles['email']}
          />

          <div className={styles['role-dropdown']}>
            <button
              onClick={() => setShowRowSelect(!showRoleSelect)}
              className={`
                ${styles['role-trigger']}
                ${styles[`${role.toLowerCase()}`]}
              `}
            >
              {role === 'PCP_PCVP' ? 'PCP/PCVP' : role}
              <i className="fa-solid fa-chevron-down"></i>
            </button>
            <div
              className={`
                ${styles['role-select']}
                ${!showRoleSelect ? styles['hide-role-select'] : ''}
              `}
            >
              {user.role === 'OWNER' &&
                <button
                  onClick={() => changeRole('ADMIN')}
                  className={`${styles['role-btn']} ${styles['admin']}`}
                >
                  ADMIN
                </button>
              }
              <button
                onClick={() => changeRole('BROTHER')}
                className={`${styles['role-btn']} ${styles['brother']}`}
              >
                BROTHER
              </button>
              <button
                onClick={() => changeRole('PCP_PCVP')}
                className={`${styles['role-btn']} ${styles['pcp_pcvp']}`}
              >
                PCP/PCVP
              </button>
              <button
                onClick={() => changeRole('PLEDGE')}
                className={`${styles['role-btn']} ${styles['pledge']}`}
              >
                PLEDGE
              </button>
              <button
                onClick={() => changeRole('NONE')}
                className={`${styles['role-btn']}`}
              >
                NONE
              </button>
            </div>
          </div>
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={updateUser}
            className={styles['yes-btn']}
          >
            Update
          </button>
          <button
            onClick={() => showModal(false)}
            className={styles['cancel-btn']}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
