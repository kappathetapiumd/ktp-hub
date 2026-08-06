import type { Pledge } from '@/lib/pledges';

import styles from './Modal.module.css';

type Props = {
  currentPledge: Pledge | undefined;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ZeroStrikesModal({ currentPledge, showModal }: Props) {
  return (
    <div className={`${styles['modal-overlay']} ${styles['strike-modal']}`}>
      <div className={`${styles['modal-container']} ${styles['warning-modal']}`}>
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-solid fa-triangle-exclamation"></i></span>
          <p className={styles['eyebrow']}>Invalid amount</p>
          <h2>Strikes cannot go below zero</h2>
          <p className={styles['message']}>
            This change would result in a negative strike total
            {currentPledge
              ? ` for ${currentPledge.name.split(' ')[0]}.`
              : '.'
            }
          </p>
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={() => showModal(false)}
            className={styles['close-btn']}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
