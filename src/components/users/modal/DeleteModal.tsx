import styles from './Modal.module.css';
import type { User } from '@/lib/users';

type Props = {
  userId: string;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  deleteAll: boolean;
}

export default function DeleteModal({ userId, setUsers, showModal, isActive, deleteAll }: Props) {
  async function deleteUser() {
    const params = new URLSearchParams({
      userId,
      deleteAll: deleteAll.toString()
    });

    const response = await fetch(`/api/users${!isActive ? '/deleted' : ''}?${params.toString()}`, {
      method: 'DELETE'
    });

    if (!response.ok) return;

    if (deleteAll) {
      setUsers([]);
    } else {
      setUsers(prev =>
        prev.filter(user => user.id !== userId)
      );
    }

    showModal(false);
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <p className={styles['message']}>
          {!isActive
            ? <>
                {'WARNING\n\n'}<br /><br />
                {`This action will delete ${deleteAll ? 'EVERY' : 'the'} user 
                and all strikes associated with them.`}<br /><br />
                {'This is PERMANENT.'}
              </>
            : 'Are you sure you want to delete this user?'
          }
        </p>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={deleteUser}
            className={styles['yes-btn']}
          >
            {isActive ? 'Yes' : 'Confirm'}
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
