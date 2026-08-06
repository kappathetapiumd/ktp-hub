import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';

import styles from './Modal.module.css';

type Props = {
  strikeId: string;
  setStrikeHistory: React.Dispatch<React.SetStateAction<Strike[]>>;
  setTotalStrikesPerWeek: React.Dispatch<React.SetStateAction<number>>;
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>;
  selectedPledge: string;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteModal({
  strikeId,
  setStrikeHistory,
  setTotalStrikesPerWeek,
  setPledges,
  selectedPledge,
  showModal
}: Props) {
  async function deleteStrike() {
    showModal(false);
    
    const params = new URLSearchParams({
      strikeId
    });

    const response = await fetch(`/api/strikes?${params.toString()}`, {
      method: 'DELETE'
    });

    if (!response.ok) return;

    const { amount: deletedAmount } = await response.json();

    // remove the deleted strikeEvent from strikeHistory array to rerender
    setStrikeHistory(prev => prev.filter(strike => strike.id !== strikeId));
    setTotalStrikesPerWeek(prev => prev - deletedAmount);

    // update pledges array with correct strike counts to rerender
    setPledges(prev =>
      prev.map(pledge =>
        pledge.id === selectedPledge
          ? { ...pledge, strikes: pledge.strikes - deletedAmount }
          : pledge
      ));
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={`${styles['modal-container']} ${styles['danger-modal']}`}>
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-solid fa-trash-can"></i></span>
          <p className={styles['eyebrow']}>Delete strike</p>
          <h2>Remove this strike?</h2>
          <p className={styles['message']}>
            This strike will be removed from the pledge’s history. This action cannot be undone.
          </p>
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={deleteStrike}
            className={styles['yes-btn']}
          >
            <i className="fa-solid fa-trash-can"></i>
            Delete strike
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
