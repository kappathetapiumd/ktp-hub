import styles from './Modal.module.css';

type Props = {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
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

export default function ClearModal({ setUsers, showModal }: Props) {
  async function clearRequirements() {
    showModal(false);

    const response = await fetch('/api/requirements', { method: 'DELETE' });

    if (!response.ok) return;

    setUsers(prev =>
      prev.map(user => {
        return {
          ...user,
          philSmallEvent: false,
          philBigEvent: false,
          profDevEventA: false,
          profDevEventB: false,
        }
      })
    );
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={`${styles['modal-container']} ${styles['danger-modal']}`}>
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-solid fa-rotate-left"></i></span>
          <p className={styles['eyebrow']}>Reset progress</p>
          <h2>Clear all requirements?</h2>
          <p className={styles['message']}>
            Every member’s requirement progress will be reset. This cannot be undone.
          </p>
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={clearRequirements}
            className={styles['yes-btn']}
          >
            <i className="fa-solid fa-trash-can"></i>
            Clear progress
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
