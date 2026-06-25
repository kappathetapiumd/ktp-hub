import type { Pledge } from '@/lib/pledges';

import styles from './Modal.module.css';

type Props = {
  currentPledge: Pledge | undefined;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ZeroStrikesModal({ currentPledge, showModal }: Props) {
  return (
    <div className={`${styles['modal-overlay']} ${styles['strike-modal']}`}>
      <div className={styles['modal-container']}>
        <p className={styles['message']}>
          This will result in a negative amount of strikes
          {currentPledge
            ? ` for ${currentPledge.name.split(' ')[0]}.`
            : '.'
          }
        </p>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={() => showModal(false)}
            className={styles['close-btn']}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
