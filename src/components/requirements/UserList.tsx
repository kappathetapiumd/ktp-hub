import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './UserList.module.css';

type Props = {
  user: CurrentUser
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

type User = {
  id: string;
  name: string;
  role: string;
  philSmallEvent: boolean;
  philBigEvent: boolean;
  profDevEventA: boolean;
  profDevEventB: boolean
}

export default function UserList({ user, users, setUsers }: Props) {
  async function updateEvent(id: string, completed: boolean, event: string) {
    const response = await fetch('/api/requirements', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        completed: !completed,
        event
      })
    });

    if (!response.ok) return;

    setUsers(prev =>
      prev.map(user => {
        return user.id !== id
          ? user
          : event === 'SMALL'
          ? { ...user, philSmallEvent: !completed }
          : event === 'BIG'
          ? { ...user, philBigEvent: !completed }
          : event === 'A'
          ? { ...user, profDevEventA: !completed }
          : { ...user, profDevEventB: !completed }
      })
    );
  }

  return (
    <div className={styles['user-list']}>
      {users.map(({
        id, role, name, philSmallEvent,
        philBigEvent, profDevEventA, profDevEventB
      }) => (
        <div
          key={id}
          className={styles['user-card']}
        >
          <span
            className={`
              ${styles['name']}
              ${styles[`${(user.role === 'ADMIN' || user.role === 'OWNER')
                && (role === 'BROTHER' ? 'brother': 'pledge')}`
              ]}
            `}
          >
            {name}
          </span>
          <div className={styles['checkboxes']}>
            <button
              onClick={() => updateEvent(id, philSmallEvent, 'SMALL')}
              disabled={user.role !== 'OWNER' && user.role !== 'ADMIN'}
              className={styles['checkbox']}
              aria-label={`${name}: small philanthropy event`}
            >
              <i
                className={`
                  fa-${philSmallEvent
                    ? 'solid fa-square-check'
                    : 'regular fa-square'}
                `}
              >
              </i>
            </button>

            <button
              onClick={() => updateEvent(id, philBigEvent, 'BIG')}
              disabled={user.role !== 'OWNER' && user.role !== 'ADMIN'}
              className={styles['checkbox']}
              aria-label={`${name}: big philanthropy event`}
            >
              <i
                className={`
                  fa-${philBigEvent
                    ? 'solid fa-square-check'
                    : 'regular fa-square'}
                `}
              >
              </i>
            </button>

            <button
              onClick={() => updateEvent(id, profDevEventA, 'A')}
              disabled={user.role !== 'OWNER' && user.role !== 'ADMIN'}
              className={styles['checkbox']}
              aria-label={`${name}: professional development event 1`}
            >
              <i
                className={`
                  fa-${profDevEventA
                    ? 'solid fa-square-check'
                    : 'regular fa-square'}
                `}
              >
              </i>
            </button>

            <button
              onClick={() => updateEvent(id, profDevEventB, 'B')}
              disabled={user.role !== 'OWNER' && user.role !== 'ADMIN'}
              className={styles['checkbox']}
              aria-label={`${name}: professional development event 2`}
            >
              <i
                className={`
                  fa-${profDevEventB
                    ? 'solid fa-square-check'
                    : 'regular fa-square'}
                `}
              >
              </i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
