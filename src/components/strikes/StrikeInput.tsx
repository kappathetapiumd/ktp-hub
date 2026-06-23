import { useState } from 'react';
import styles from './StrikeInput.module.css';
import type { Pledge } from '@/lib/pledges';

// Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro officiis natus dolor vero repellat rem, autem quod dolorem amet ratione est voluptas, harum perspiciatis nobis sequi magni, eum corrupti praesentium.

type Props = {
  pledges: Pledge[],
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>,
  selectedPledge: string
}

export default function StrikeInput({ pledges, setPledges, selectedPledge }: Props) {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');

  async function addStrike() {
    await fetch('/api/strikes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pledgeId: selectedPledge,
        createdById: 'nikhil',
        amount: Number(amount),
        reason
      })
    });

    setPledges(pledges.map((pledge) => {
      return pledge.id === selectedPledge
        ? { ...pledge, strikes: pledge.strikes + Number(amount)} 
        : pledge
    }));

    setReason('');
    setAmount('');
  }

  const invalidStrike = !reason || !/^-?[1-9]\d*$/.test(amount);

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
        disabled={invalidStrike}
        className={styles['add-btn']}
      >
        <i className="fa-solid fa-plus"></i>
      </button>
    </div>
  );
}
