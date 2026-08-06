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
      <div className={styles['modal-container']}>
        <p className={styles['message']}>
          Are you sure you want to clear ALL requirements?
        </p>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={clearRequirements}
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
