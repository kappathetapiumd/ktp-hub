import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';

import styles from './Modal.module.css';

type Props = {
  strikeId: string;
  setStrikeHistory: React.Dispatch<React.SetStateAction<Strike[]>>;
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>;
  selectedPledge: string;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteModal(
  { strikeId, setStrikeHistory, setPledges, selectedPledge, showModal }: Props
) {
  async function deleteStrike() {
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

    // update pledges array with correct strike counts to rerender
    setPledges(prev =>
      prev.map(pledge =>
        pledge.id === selectedPledge
          ? { ...pledge, strikes: pledge.strikes - deletedAmount }
          : pledge
      ));

    showModal(false);
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <p className={styles['message']}>
          Are you sure you want to delete this strike?
          <br />
          {`This action can't be undone.`}
        </p>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={deleteStrike}
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
