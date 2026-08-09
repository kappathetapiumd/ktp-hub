import { useState } from 'react';

import { invalidStrike } from '@/lib/utils';

import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './Modal.module.css';

type Props = {
  user: CurrentUser;
  strikeId: string;
  strikeHistory: Strike[];
  setStrikeHistory: React.Dispatch<React.SetStateAction<Strike[]>>;
  setTotalStrikesPerWeek: React.Dispatch<React.SetStateAction<number>>;
  pledges: Pledge[];
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>;
  selectedPledge: string;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStrikesModal: React.Dispatch<React.SetStateAction<boolean>>;
  weeks: string[];
}

export default function EditModal(
  {
    user,
    strikeId,
    strikeHistory,
    setStrikeHistory,
    setTotalStrikesPerWeek,
    pledges,
    setPledges,
    selectedPledge,
    showModal,
    setShowStrikesModal,
    weeks
  }: Props
) {
  const strike = strikeHistory.find(strike => strike.id === strikeId)!;

  const [reason, setReason] = useState(strike.reason);
  const [amount, setAmount] = useState(strike.amount.toString());
  const originalAmount = strike.amount;

  async function editStrike() {
    const currentPledge = pledges.find(pledge => pledge.id === selectedPledge)!;
    
    // if the updated strike amount will cause a pledge to have negative strikes, don't update
    if (currentPledge.strikes - originalAmount + Number(amount) < 0) {
      setShowStrikesModal(true);
      return;
    }

    showModal(false);

    const response = await fetch('/api/strikes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: strikeId,
        amount: Number(amount),
        reason,
        pledgeId: selectedPledge,
        createdById: user.id
      })
    });

    if (!response.ok) return;

    const updatedAmount = Number(amount);

    // update the amount in strikeHistory array to rerender
    setStrikeHistory(prev =>
      prev.map(strike =>
        strike.id === strikeId
          ? { ...strike, reason, amount: updatedAmount }
          : strike
      ));

    // update pledges array with correct strike counts to rerender
    setPledges(prev =>
      prev.map(pledge =>
        pledge.id === selectedPledge
          ? {
              ...pledge,
              strikes: pledge.strikes - originalAmount + updatedAmount
            }
          : pledge
    ));

    setTotalStrikesPerWeek(prev => prev - originalAmount + updatedAmount);
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']} role="dialog" aria-modal="true" aria-labelledby="edit-strike-title">
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-solid fa-pen"></i></span>
          <p className={styles['eyebrow']}>Strike details</p>
          <h2 id="edit-strike-title">Edit strike</h2>
          <p className={styles['message']}>Update the reason or adjust the strike amount.</p>
        </div>

        <div className={styles['strike-content']}>
          <label>
            <span>Reason</span>
            <textarea
              onChange={e => { setReason(e.target.value) }}
              value={reason}
              className={styles['reason-input']}
              placeholder="Reason"
              rows={2}
              suppressHydrationWarning
            />
          </label>

          <label>
            <span>Amount</span>
            <input
              onChange={e => setAmount(e.target.value)}
              value={amount}
              type="text"
              className={styles['amount-input']}
              inputMode="numeric"
              placeholder="#"
              suppressHydrationWarning
            />
          </label>
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={editStrike}
            disabled={invalidStrike(reason, amount, selectedPledge, weeks)}
            className={styles['yes-btn']}
          >
            <i className="fa-solid fa-check"></i>
            Update
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
