import { useState } from 'react';
import type { RequirementUser as User } from '@/lib/requirement-types';
import styles from './Modal.module.css';

type Props = {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ClearModal({ setUsers, showModal }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function clearRequirements() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/requirements?action=clear-progress', { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not clear progress. Please try again.');
      setUsers(prev => prev.map(user => ({ ...user, completedRequirementIds: [] })));
      showModal(false);
    } catch { setError('Could not clear progress. Please try again.'); }
    finally { setBusy(false); }
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={`${styles['modal-container']} ${styles['danger-modal']}`} role="alertdialog" aria-modal="true" aria-labelledby="clear-requirements-title">
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-solid fa-rotate-left"></i></span>
          <p className={styles['eyebrow']}>Reset progress</p>
          <h2 id="clear-requirements-title">Clear all progress?</h2>
          <p className={styles['message']}>
            Every member’s individual requirement progress will be reset. Requirements and group pledge tasks will be kept. This cannot be undone.
          </p>
        </div>

        {error && <p role="alert">{error}</p>}
        <div className={styles['confirmation-btns']}>
          <button
            onClick={clearRequirements}
            disabled={busy}
            className={styles['yes-btn']}
          >
            <i className="fa-solid fa-trash-can"></i>
            Clear progress
          </button>
          <button
            onClick={() => showModal(false)}
            disabled={busy}
            className={styles['cancel-btn']}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
