import { useState } from 'react';
import styles from './Modal.module.css';

type Props = {
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WeekModal({ showModal }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  async function generateWeeks() {
    const response = await fetch('/api/weeks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate,
        endDate
      })
    });

    if (!response.ok) return;

    showModal(false);
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <div className={styles['date-selector']}>
          <p className={styles['date-label']}>
            Select the start and end date of pledging.
          </p>

          <label>Start Date</label>
          <input
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            type="date"
            className={styles['date-input']}
          />

          <label>End Date</label>
          <input
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            type="date"
            className={styles['date-input']}
          />
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={generateWeeks}
            disabled={invalidDates(startDate, endDate)}
            className={styles['yes-btn']}
          >
            Create Term
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

function invalidDates(startDate: string, endDate: string) {
  if (!startDate || !endDate) return true;

  return new Date(startDate) >= new Date(endDate)
}
