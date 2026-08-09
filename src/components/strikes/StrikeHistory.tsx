import dayjs from 'dayjs';

import type { Strike } from '@/lib/strikes';
import type { CurrentUser } from '@/lib/auth/currentUser';
import FetchingState from '@/components/loading/FetchingState';

import styles from './StrikeHistory.module.css';

type Props = {
  user: CurrentUser;
  strikeHistory: Strike[];
  totalStrikesPerWeek: number;
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setStrikeId: React.Dispatch<React.SetStateAction<string>>;
  selectedPledge: string;
  isLoading: boolean;
}

export default function StrikeHistory(
  {
    user,
    strikeHistory,
    totalStrikesPerWeek,
    setShowDeleteModal,
    setShowEditModal,
    setStrikeId,
    selectedPledge,
    isLoading
  }: Props
) {
  function handleDelete(id: string) {
    setStrikeId(id);
    setShowDeleteModal(true);
  }

  function handleEdit(id: string) {
    setStrikeId(id);
    setShowEditModal(true);
  }

  const isPledge = user.role === 'PLEDGE';

  return (
    <div className={styles['strike-history-container']}>
      <div className={styles['history-heading']}>
        <div>
          <span className={styles['history-icon']}><i className="fa-solid fa-clock-rotate-left"></i></span>
          <div>
            <p className={styles['eyebrow']}>Selected week</p>
            <h2>Strike history</h2>
          </div>
        </div>
        <span className={`${styles['week-amount']} ${totalStrikesPerWeek > 0 ? styles['positive'] : styles['neutral']}`}>
          {isLoading
            ? '—'
            : totalStrikesPerWeek > 0
            ? `+${totalStrikesPerWeek}`
            : totalStrikesPerWeek}
        </span>
      </div>

      <div className={styles['strike-card-list']}>
        {!selectedPledge
          ? <div className={styles['info-message']}>
              <span><i className="fa-solid fa-user-check"></i></span>
              <h3>Select a Pledge</h3>
              <p>Choose someone from the roster to view their history.</p>
            </div>
          : isPledge
          ? <div className={styles['info-message']}>
              <span><i className="fa-solid fa-lock"></i></span>
              <h3>History is Private</h3>
              <p>{`Pledges can't view strike history.`}</p>
            </div>
          : isLoading
          ? <FetchingState
              label="Fetching Strike History…"
              className={styles['history-fetching']}
            />
          : strikeHistory.length === 0
          ? <div className={styles['info-message']}>
              <span><i className="fa-solid fa-circle-check"></i></span>
              <h3>All Clear</h3>
              <p>There are no strikes for this week.</p>
            </div>
          : strikeHistory.map((
              { id, amount, reason, createdBy, createdAt, createdById }
            ) => (
              <div
                key={id}
                className={`
                  ${styles['strike-card']}
                  ${styles[`${amount > 0 ? 'added' : 'removed'}`]}
                `}
              >
                <div className={styles['strike-event']}>
                  <p className={styles['amount']}>
                    {amount > 0 ? `+${amount}` : amount}
                  </p>

                  <div className={styles['strike-content']}>
                    <p className={styles['reason']}>{reason}</p>

                    <div className={styles['footer']}>
                      <div className={styles['update-btns']}>
                        {user.membershipCommittee
                          && (
                            user.id === createdById
                            || user.role === 'ADMIN'
                            || user.role === 'OWNER'
                          ) &&
                          <>
                            <button
                              onClick={() => handleDelete(id)}
                              className={styles['delete-btn']}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                              <span>Delete</span>
                            </button>
                            <button
                              onClick={() => handleEdit(id)}
                              className={styles['edit-btn']}
                            >
                              <i className="fa-solid fa-pen"></i>
                              <span>Edit</span>
                            </button>
                          </>
                        }
                      </div>

                      <div className={styles['meta']}>
                        <span className={styles['name']}>
                          {createdBy}
                        </span>
                        <span className={styles['date']}>
                          {formatDate(createdAt)}
                        </span>
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
