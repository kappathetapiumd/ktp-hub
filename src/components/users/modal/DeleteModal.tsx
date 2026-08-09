import type { User } from '@/lib/users';

import styles from './Modal.module.css';

type Props = {
  userId: string;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  deleteAll: boolean;
}

export default function DeleteModal(
  { userId, setUsers, showModal, isActive, deleteAll }: Props
) {
  async function deleteUser() {
    showModal(false);

    if (deleteAll) {
      setUsers([]);
    } else {
      setUsers(prev =>
        prev.filter(user => user.id !== userId)
      );
    }

    const params = new URLSearchParams({
      userId,
      deleteAll: deleteAll.toString()
    });

    await fetch(
      `/api/users${!isActive ? '/deleted' : ''}?${params.toString()}`,
      { method: 'DELETE' }
    );
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={`${styles['modal-container']} ${styles['danger-modal']}`}>
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}>
            <i className={`fa-solid ${deleteAll ? 'fa-dumpster' : 'fa-user-minus'}`}></i>
          </span>
          <p className={styles['eyebrow']}>
            {isActive ? 'Archive member' : 'Permanent deletion'}
          </p>
          <h2>
            {deleteAll
              ? 'Empty the entire archive?'
              : isActive
                ? 'Delete this user?'
                : 'Permanently delete this user?'}
          </h2>
          <p className={styles['message']}>
            {!isActive
              ? `This will permanently delete ${deleteAll ? 'every archived user' : 'this user'} and all associated strikes. This cannot be undone.`
              : 'This user will be moved to the archive and can be restored later.'
            }
          </p>
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={deleteUser}
            className={styles['yes-btn']}
          >
            <i className="fa-solid fa-trash-can"></i>
            {isActive ? 'Delete user' : 'Delete permanently'}
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
