import type { User } from '@/lib/users';

import styles from './Modal.module.css';

type Props = {
  userId: string;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ActiveModal({ userId, setUsers, showModal }: Props) {
  async function setUserActive() {
    showModal(false);

    const response = await fetch('/api/users/deleted', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId
      })
    });

    if (!response.ok) return;

    setUsers(prev =>
      prev.filter(user => user.id !== userId)
    );
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <p className={styles['message']}>
          Do you want to reinstate this user?
        </p>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={setUserActive}
            className={styles['yes-btn']}
          >
            Yes
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
