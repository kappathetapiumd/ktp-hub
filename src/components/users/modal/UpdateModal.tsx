import { useState } from 'react';

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
  }

  return (
    <div
      onClick={() => showRoleSelect && setShowRowSelect(false)}
      onKeyDown={e => closeRowSelect(e)}
      className={styles['modal-overlay']}
    >
      <div className={styles['modal-container']}>
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-solid fa-user-pen"></i></span>
          <p className={styles['eyebrow']}>Member details</p>
          <h2>Edit user</h2>
          <p className={styles['message']}>Update this member’s contact information and role.</p>
        </div>

        <div className={styles['user-content']}>
          <label>
            <span>Full name</span>
            <input
              onChange={e => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Full name"
              className={styles['name']}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className={styles['email']}
            />
          </label>

          <label>
            <span>Role</span>
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
          </label>
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={updateUser}
            className={styles['yes-btn']}
          >
            <i className="fa-solid fa-check"></i>
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
