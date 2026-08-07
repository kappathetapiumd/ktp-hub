import { useState } from 'react';

import { addedToThisWeek, invalidStrike } from '@/lib/utils';

import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './StrikeInput.module.css';

type Props = {
  user: CurrentUser;
  pledges: Pledge[];
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>;
  setStrikeHistory: React.Dispatch<React.SetStateAction<Strike[]>>;
  setTotalStrikesPerWeek: React.Dispatch<React.SetStateAction<number>>;
  selectedPledge: string;
  setShowStrikesModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWeek: string;
  weeks: string[];
}

const reasonPlaceholders = [
  `Pratham won't shut up`,
  `Ajay sucks at GeoGuessr`,
  `Kanhav can't score a penalty`
];

export default function StrikeInput(
  {
    user,
    pledges,
    setPledges,
    setStrikeHistory,
    setTotalStrikesPerWeek,
    selectedPledge,
    setShowStrikesModal,
    selectedWeek,
    weeks
  }: Props
) {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [processingStrike, setProcessingStrike] = useState(false);

  const [randomPlaceholder, setRandomPlaceHolder] = useState(() => {
    const randomIndex = Math.floor(Math.random() * reasonPlaceholders.length);
    return reasonPlaceholders[randomIndex];
  });

  async function addStrike() {
    setProcessingStrike(true);

    const currentPledge = pledges.find(pledge => pledge.id === selectedPledge)!;
    
    // if total strikes for a pledge will be negative, don't add the strike
    if (currentPledge.strikes + Number(amount) < 0) {
      setShowStrikesModal(true);
      return;
    }

    const response = await fetch('/api/strikes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pledgeId: selectedPledge,
        createdById: user.id,
        amount: Number(amount),
        reason
      })
    });

    if (!response.ok) return;

    const strikeEvent = await response.json();

    setReason('');
    setAmount('');

    const randomIndex = Math.floor(Math.random() * reasonPlaceholders.length);
    setRandomPlaceHolder(reasonPlaceholders[randomIndex]);

    // update pledges array to rerender pledge list with correct strike counts
    setPledges(prev => 
      prev.map((pledge) =>
        pledge.id === selectedPledge
          ? { ...pledge, strikes: pledge.strikes + Number(amount)} 
          : pledge
    ));

    // update strikeHistory array to rerender with the new strike only if it's 
    // the current week
    if (addedToThisWeek(selectedWeek)) {
      setTotalStrikesPerWeek(prev => prev + strikeEvent.amount);
      setStrikeHistory(prev => [{
        id: strikeEvent.id,
        amount: strikeEvent.amount,
        reason: strikeEvent.reason,
        createdAt: strikeEvent.createdAt,
        createdBy: strikeEvent.createdBy,
        createdById: strikeEvent.createdById
      }, ...prev]);
    }

    setProcessingStrike(false);
  }

  // if not on membership committee, can't add strike
  if (!user.membershipCommittee) return <></>;

  return (
    <div className={styles['strike-input-container']}>
      <div className={styles['input-heading']}>
        <span><i className="fa-solid fa-plus"></i></span>
        <div>
          <strong>Add a Strike</strong>
          <small>Positive numbers add strikes; negative numbers remove them</small>
        </div>
      </div>

      <div className={styles['strike-content']}>
        <label>
          <span>Reason</span>
          <textarea
            onChange={e => setReason(e.target.value)}
            value={reason}
            className={styles['reason-input']}
            placeholder={`e.g. ${randomPlaceholder}`}
            rows={1}
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
            placeholder="#"
            suppressHydrationWarning
          />
        </label>

        <button
          onClick={addStrike}
          disabled={
            invalidStrike(reason, amount, selectedPledge, weeks)
              || processingStrike
          }
          className={styles['add-btn']}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  );
}
