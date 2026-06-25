import styles from './UserList.module.css';
import type { User } from '@/lib/users';

type Props = {
  users: User[];
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  isUpdating: boolean;
  isDeleting: boolean;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UserList(
  { users, setUserId, isUpdating, isDeleting, setShowDeleteModal, setShowUpdateModal, setUsers }: Props
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
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        membershipCommittee: !membershipCommittee
      })
    });

    if (!response.ok) return;

    // set the user's membership committee status and rerender the list
    setUsers(prev =>
      prev.map(user => 
        user.id === id
        ? {...user, membershipCommittee: !membershipCommittee}
        : user
      )
    );
  }

  return (
    <div className={styles['user-list']}>
      {users.map(({ id, email, name, role, membershipCommittee }) => (
        <div
          key={id}
          onClick={() => handleModification(id)}
          className={`
            ${styles['user-card']}
            ${isUpdating || isDeleting ? styles['active'] : ''}
            ${isDeleting ? styles['delete'] : ''}
            ${isUpdating ? styles['update'] : ''}
          `}
        >
          <div className={styles['user-info']}>
            <span className={`${styles['name']} ${styles[`${role.toLowerCase()}`]}`}>{name}</span>
            <span className={styles['email']}>{email}</span>
          </div>

          <span className={`${styles['role']} ${styles[`${role.toLowerCase()}`]}`}>
            {role !== 'PCP_PCVP' ? role : 'PCP/PCVP'}
          </span>

          <button
            onClick={() => updateMembership(id, membershipCommittee)}
            disabled={role !== 'BROTHER' || isUpdating || isDeleting}
            className={styles['membership-toggle']}
          >
            <i className={`fa-${membershipCommittee ? 'solid fa-square-check' : 'regular fa-square'}`}></i>
          </button>
        </div>
      ))}
    </div>
  );
}
