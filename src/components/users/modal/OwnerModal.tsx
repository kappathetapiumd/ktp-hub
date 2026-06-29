import { useState } from 'react';

import type { User } from '@/lib/users';

import styles from './Modal.module.css';

type Props = {
  users: User[];
  showModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OwnerModal({ users, showModal }: Props) {
  const [email, setEmail] = useState('');
  const [clickedTwice, setClickedTwice] = useState(false);

  async function transferOwnership() {
    const user = users.find(user => user.email === email);

    if (!user) {
      setClickedTwice(false);
      setEmail('No user with that email.');
      return;
    }

    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': '/application/json' },
      body: JSON.stringify({
        email,
        transfer: true
      })
    });

    if (!response.ok) return;

    showModal(false);
    window.location.reload();
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-container']}>
        <div className={styles['user-content']}>
          <input
            onChange={e => setEmail(e.target.value)}
            value={email}
            placeholder='Enter the email of the new owner.'
            className={styles['email']}
          />
        </div>

        <div className={styles['confirmation-btns']}>
          <button
            onClick={() => !clickedTwice
              ? setClickedTwice(true)
              : transferOwnership()
            }
            disabled={
              !email || !email.includes('@') || !email.includes('umd.edu')
            }
            className={styles['yes-btn']}
          >
            {!clickedTwice ? 'Click to transfer' : 'Click again to confirm'}
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
