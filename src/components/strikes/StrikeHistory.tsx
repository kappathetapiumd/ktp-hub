import dayjs from 'dayjs';
import styles from './StrikeHistory.module.css';
import type { Strike } from '@/lib/strikes';

type Props = {
  strikeHistory: Strike[];
  totalStrikesPerWeek: number;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setStrikeId: React.Dispatch<React.SetStateAction<string>>;
  selectedPledge: string;
}

export default function StrikeHistory(
  { strikeHistory, totalStrikesPerWeek, setShowDeleteModal, setShowEditModal, setStrikeId, selectedPledge }: Props
) {
  function handleDelete(id: string) {
    setStrikeId(id);
    setShowDeleteModal(true);
  }

  function handleEdit(id: string) {
    setStrikeId(id);
    setShowEditModal(true);
  }

  return (
    <div className={styles["strike-history-container"]}>
      <h1 className={styles["week-amount"]}>
        Strikes: 
        <span>
          {totalStrikesPerWeek > 0 ? `+${totalStrikesPerWeek}` : totalStrikesPerWeek}
        </span>
      </h1>

      <div className={styles["horizontal-line"]}></div>

      <div className={styles['strike-card-list']}>
        {!selectedPledge
          ? <p className={styles['info-message']}>Please select a pledge.</p>
          : strikeHistory.length === 0
          ? <p className={styles['info-message']}>No strikes yet...</p>
          : strikeHistory.map(({ id, amount, reason, createdBy, createdAt }) => (
              <div
                key={id}
                className={
                  `${styles['strike-card']} ${styles[`${amount > 0 ? 'added' : 'removed'}`]}`}
              >
                <div className={styles["strike-event"]}>
                  <p className={styles["amount"]}>
                    {amount > 0 ? `+${amount}` : amount}
                  </p>

                  <div className={styles["vertical-line"]}></div>

                  <div className={styles["strike-content"]}>
                    <p className={styles["reason"]}>{reason}</p>

                    <div className={styles["footer"]}>
                      <div className={styles["update-btns"]}>
                        <button
                          onClick={() => handleDelete(id)}
                          className={styles["delete-btn"]}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(id)}
                          className={styles["edit-btn"]}
                        >
                          Edit
                        </button>
                      </div>

                      <div className={styles["meta"]}>
                        <span className={styles["name"]}>{createdBy}</span>
                        <span className={styles["date"]}>{formatDate(createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return dayjs(date).format('MM/D • h:mm A')
}
