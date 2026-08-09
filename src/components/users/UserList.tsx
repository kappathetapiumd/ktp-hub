import type { User } from '@/lib/users';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './UserList.module.css';

type Props = {
  user: CurrentUser;
  users: User[];
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  isUpdating: boolean;
  isDeleting: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UserList(
  {
    user,
    users,
    setUserId,
    isUpdating,
    isDeleting,
    setShowDeleteModal,
    setShowUpdateModal,
    setUsers
  }: Props
) {
  function handleModification(id: string) {
    if (!isUpdating && !isDeleting) return;
    
    setUserId(id);

    if (isDeleting)
      setShowDeleteModal(true);

    if (isUpdating)
      setShowUpdateModal(true);
  }

  async function updateMembership(id: string, membershipCommittee: boolean) {
    // set the user's membership committee status and rerender the list
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, membershipCommittee: !membershipCommittee }
          : user
      )
    );

    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        membershipCommittee: !membershipCommittee
      })
    });
  }

  return (
    <div className={styles['user-list']}>
      {users.map(({ id, email, name, role, membershipCommittee }) => {
        const canModify = role !== 'OWNER'
          && !(user.role === 'ADMIN' && role === 'ADMIN')

        return (
          <div
            key={id}
            onClick={() => canModify ? handleModification(id) : {}}
            className={`
              ${styles['user-card']}
              ${canModify ? `
                ${isUpdating || isDeleting ? styles['active'] : ''}
                ${isDeleting ? styles['delete'] : ''}
                ${isUpdating ? styles['update'] : ''}`
              : ''}
            `}
          >
            <div className={styles['user-info']}>
              <span
                className={`${styles['name']} ${styles[`${role.toLowerCase()}`]}`}
              >
                {name}
              </span>
              <span className={styles['email']}>{email}</span>
            </div>

            <span
              className={`${styles['role']} ${styles[`${role.toLowerCase()}`]}`}
            >
              {role !== 'PCP_PCVP' ? role : 'PCP/PCVP'}
            </span>

            <button
              onClick={event => {
                event.stopPropagation();
                updateMembership(id, membershipCommittee);
              }}
              disabled={role !== 'BROTHER' || isUpdating || isDeleting}
              aria-pressed={membershipCommittee}
              aria-label={`${name}: membership committee`}
              className={styles['membership-toggle']}
            >
              <i
                className={`
                  fa-${membershipCommittee
                    ? 'solid fa-square-check'
                    : 'regular fa-square'}
                `}
              >
              </i>
            </button>
          </div>
        );
      })}
    </div>
  );
}
