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

    showModal(false);

    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': '/application/json' },
      body: JSON.stringify({
        email,
        transfer: true
      })
    });

    if (!response.ok) return;

    window.location.reload();
  }

  return (
    <div className={styles['modal-overlay']}>
      <div className={`${styles['modal-container']} ${styles['owner-modal']}`} role="dialog" aria-modal="true" aria-labelledby="owner-modal-title">
        <div className={styles['modal-heading']}>
          <span className={styles['modal-icon']}><i className="fa-solid fa-crown"></i></span>
          <p className={styles['eyebrow']}>Chapter ownership</p>
          <h2 id="owner-modal-title">Transfer ownership</h2>
          <p className={styles['message']}>
            Enter the new owner’s university email. You’ll confirm once more before transferring.
          </p>
        </div>

        <div className={styles['user-content']}>
          <label>
            <span>New owner email</span>
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="name@umd.edu"
              className={styles['email']}
            />
          </label>
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
            <i className="fa-solid fa-crown"></i>
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
