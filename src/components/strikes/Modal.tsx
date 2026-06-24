import { useRef, useState } from 'react';
import styles from './Modal.module.css';
import type { Pledge } from '@/lib/pledges';
import type { Strike } from '@/lib/strikes';

type ZeroStrikesProps = {
  currentPledge: Pledge | undefined;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type DeleteProps = {
  strikeId: string;
  setStrikeHistory: React.Dispatch<React.SetStateAction<Strike[]>>;
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>;
  selectedPledge: string;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type EditProps = {
  strikeId: string;
  strikeHistory: Strike[];
  setStrikeHistory: React.Dispatch<React.SetStateAction<Strike[]>>;
  pledges: Pledge[];
  setPledges: React.Dispatch<React.SetStateAction<Pledge[]>>;
  selectedPledge: string;
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStrikesModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ZeroStrikesModal({ currentPledge, showModal }: ZeroStrikesProps) {
  return (
    <div className={`${styles['modal-overlay']} ${styles['strike-modal']}`}>
      <div className={styles['modal-container']}>
        <p className={styles['message']}>
          This action will result in a negative amount of strikes
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

export function DeleteModal(
  { strikeId, setStrikeHistory, setPledges, selectedPledge, showModal }: DeleteProps
) {
  async function deleteStrike() {
    const params = new URLSearchParams({
      strikeId
    });

    const response = await fetch(`/api/strikes?${params.toString()}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) return;

    const deletedStrike = await response.json();

    // remove the deleted strikeEvent from strikeHistory array to rerender
    setStrikeHistory(prev => prev.filter(strike => strike.id !== strikeId));

    // update pledges array with correct strike counts to rerender
    setPledges(prev =>
      prev.map(pledge =>
        pledge.id === selectedPledge
          ? { ...pledge, strikes: pledge.strikes - deletedStrike.amount }
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

export function EditModal(
  { strikeId, strikeHistory, setStrikeHistory, pledges, setPledges, selectedPledge, showModal, setShowStrikesModal }: EditProps
) {
  const strike = strikeHistory.find(strike => strike.id === strikeId)!;

  const [reason, setReason] = useState(strike.reason);
  const [amount, setAmount] = useState(strike.amount.toString());
  const originalAmount = useRef(strike.amount);

  async function editStrike() {
    // if the updated strike amount will cause a pledge to have negative strikes, don't update
    const currentPledge = pledges.find(pledge => pledge.id === selectedPledge)!;
    if (currentPledge.strikes + - originalAmount.current + Number(amount) < 0) {
      setShowStrikesModal(true);
      return;
    }

    const response = await fetch('/api/strikes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: strikeId,
        amount: Number(amount),
        reason
      })
    });

    if (!response.ok) return;

    // update the amount in strikeHistory array to rerender
    setStrikeHistory(prev =>
      prev.map(strike =>
        strike.id === strikeId
          ? {...strike, reason: reason, amount: Number(amount)}
          : strike
    ));

    // update pledges array with correct strike counts to rerender
    setPledges(prev =>
      prev.map(pledge =>
        pledge.id === selectedPledge
          ? {...pledge, strikes: pledge.strikes - originalAmount.current + Number(amount)}
          : pledge
    ));

    showModal(false);
  }

  const invalidStrike = !reason || !/^-?[1-9]\d*$/.test(amount);

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <div className={styles['strike-content']}>
          <textarea
            onChange={e => {setReason(e.target.value)}}
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
        <div className={styles['confirmation-btns']}>
          <button
            onClick={editStrike}
            disabled={invalidStrike}
            className={styles['yes-btn']}
          >
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
