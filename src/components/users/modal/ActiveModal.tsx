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
      <div className={styles['modal-container']} role="alertdialog" aria-modal="true" aria-labelledby="reinstate-user-title">
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-solid fa-user-check"></i></span>
          <p className={styles['eyebrow']}>Restore access</p>
          <h2 id="reinstate-user-title">Reinstate this user?</h2>
          <p className={styles['message']}>
            This user will return to the active member directory.
          </p>
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={setUserActive}
            className={styles['yes-btn']}
          >
            <i className="fa-solid fa-rotate-left"></i>
            Restore user
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
