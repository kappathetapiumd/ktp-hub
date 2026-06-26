import { useState } from 'react';
import dayjs from 'dayjs';

import { invalidStrike } from '@/lib/utils';

import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './StrikeInput.module.css';

type Props = {
  user: CurrentUser;
  pledges: Pledge[];
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>;
  setStrikeHistory: React.Dispatch<React.SetStateAction<Strike[]>>;
  selectedPledge: string;
  setShowStrikesModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWeek: string;
  weeks: string[];
}

export default function StrikeInput(
  {
    user,
    pledges,
    setPledges,
    setStrikeHistory,
    selectedPledge,
    setShowStrikesModal,
    selectedWeek,
    weeks
  }: Props
) {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');

  async function addStrike() {
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
      setStrikeHistory(prev => [{
        id: strikeEvent.id,
        amount: Number(amount),
        reason,
        createdAt: strikeEvent.createdAt,
        createdBy: strikeEvent.createdBy,
        createdById: strikeEvent.createdById
      }, ...prev]);
    }

    setReason('');
    setAmount('');
  }

  // if not on membership committee, can't add strike
  if (!user.membershipCommittee) return <></>;

  return (
    <div className={styles['strike-input-container']}>
      <div className={styles['strike-content']}>
        <textarea
          onChange={e => setReason(e.target.value)}
          value={reason}
          className={styles['reason-input']}
          placeholder="Reason"
          rows={1}
          suppressHydrationWarning
        />

        <input
          onChange={e => setAmount(e.target.value)}
          value={amount}
          type="text"
          className={styles['amount-input']}
          inputMode="numeric"
          placeholder="#"
          suppressHydrationWarning
        />
      </div>

      <button
        onClick={addStrike}
        disabled={invalidStrike(reason, amount, selectedPledge, weeks)}
        className={styles['add-btn']}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}

function addedToThisWeek(selectedWeek: string) {
  const [start, end] = selectedWeek.split(' - ');

  const today = dayjs();
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  return (today.isAfter(startDate) && today.isBefore(endDate))
    || today.isSame(startDate) || today.isSame(endDate);
}
