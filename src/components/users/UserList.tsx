import styles from './UserList.module.css';
import type { User } from '@/lib/users';

type Props = {
  users: User[];
  isUpdating: boolean;
  isDeleting: boolean;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UserList({ users, isUpdating, isDeleting, setUsers }: Props) {
  function handleModification() {
    if (!isUpdating && !isDeleting) return;
  }

  return (
    <div className={styles['user-list']}>
      {users.map(({ id, email, name, role, membershipCommittee }) => (
        <div
          key={id}
          onClick={handleModification}
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
            disabled={role !== 'BROTHER'}
            className={styles['membership-toggle']}
          >
            <i className={`fa-${membershipCommittee ? 'solid fa-square-check' : 'regular fa-square'}`}></i>
          </button>
        </div>
      ))}
    </div>
  );
}
