import { useState } from 'react';
import dayjs from 'dayjs';

import { invalidStrike } from '@/lib/utils';

import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';

import styles from './StrikeInput.module.css';

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro officiis natus dolor vero repellat rem, autem quod dolorem amet ratione est voluptas, harum perspiciatis nobis sequi magni, eum corrupti praesentium.

type Props = {
  pledges: Pledge[];
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>;
  setStrikeHistory: React.Dispatch<React.SetStateAction<Strike[]>>;
  selectedPledge: string;
  setShowStrikesModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWeek: string;
  weeks: string[];
}

/*
************** TODO **************
- can't add strike if current date is past last date
*/


export default function StrikeInput(
  {
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
    // when logging in, each user will have a name, id, etc. so look into simplifying my prisma

    // if total strikes for a pledge will be negative, don't add the strike
    const currentPledge = pledges.find(pledge => pledge.id === selectedPledge)!;
    if (currentPledge.strikes + Number(amount) < 0) {
      setShowStrikesModal(true);
      return;
    }

    const response = await fetch('/api/strikes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pledgeId: selectedPledge,
        createdById: 'nikhil',
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

    // update strikeHistory array to rerender with the new strike only if it's the current week
    if (addedToThisWeek(selectedWeek)) {
      setStrikeHistory(prev => [{
        id: strikeEvent.id,
        amount: Number(amount),
        reason,
        createdAt: strikeEvent.createdAt,
        createdBy: strikeEvent.createdBy
      }, ...prev]);
    }

    setReason('');
    setAmount('');
  }

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
