import { useState } from 'react';

import styles from './Modal.module.css';

type Props = {
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WeekModal({ showModal }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  async function generateWeeks() {
    if (isCreating) return;
    setIsCreating(true);

    try {
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
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']} role="dialog" aria-modal="true" aria-labelledby="week-modal-title">
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-regular fa-calendar"></i></span>
          <p className={styles['eyebrow']}>Term setup</p>
          <h2 id="week-modal-title">Generate chapter weeks</h2>
          <p className={styles['message']}>
            Choose the first and last day of the pledging term.
          </p>
        </div>

        <div className={styles['date-selector']}>
          <label htmlFor="term-start-date">Start Date</label>
          <input
            id="term-start-date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            type="date"
            className={styles['date-input']}
          />

          <label htmlFor="term-end-date">End Date</label>
          <input
            id="term-end-date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            type="date"
            className={styles['date-input']}
          />
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={generateWeeks}
            disabled={invalidDates(startDate, endDate) || isCreating}
            className={styles['yes-btn']}
          >
            <i className="fa-solid fa-calendar-plus"></i>
            {isCreating ? 'Creating…' : 'Create Term'}
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

  return startDate >= endDate;
}
