import Link from 'next/link';

import type { Pledge } from '@/lib/pledges';
import type { CurrentUser } from '@/lib/auth/currentUser';

import styles from './PledgeSideBar.module.css';

type Props = {
  user: CurrentUser;
  pledges: Pledge[];
  totalStrikes: number;
  selectedPledge: string;
  setSelectedPledge: React.Dispatch<React.SetStateAction<string>>;
  showSideBar: boolean;
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PledgeSideBar(
  {
    user,
    pledges,
    totalStrikes,
    selectedPledge,
    setSelectedPledge,
    showSideBar,
    setShowSideBar
  }: Props
) {
  return (
    <>
      <div
        className={`
          ${styles['sidebar']}
          ${!showSideBar ? styles['hide-bar'] : ''}
        `}
      >
        <div className={styles['header']}>
          <div className={styles['brand']}>
            <span className={styles['brand-icon']}>
              <i className="fa-solid fa-bolt"></i>
            </span>
            <div>
              <small>Strike Sheet</small>
              <strong>Pledge Roster</strong>
            </div>
          </div>
          <button
            onClick={() => setShowSideBar(false)}
            className={styles['close-sidebar']}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={styles['total-strikes']}>
          <div>
            <span>Total</span>
            <small>Across all pledges</small>
          </div>
          <strong>{totalStrikes}</strong>
        </div>

        <div className={styles['list-label']}>
          <span>Pledges</span>
          <small>{pledges.length}</small>
        </div>

        <div className={styles['pledge-list']}>
          {pledges.map(({ id, name, strikes }) => (
            <div
              onClick={() => setSelectedPledge(id)}
              key={id}
              className={`
                ${styles['pledge-card']} 
                ${styles[
                  `${strikes >= 6 ? 'red' : strikes >= 3 ? 'yellow' : 'green'}`
                ]}
                ${styles[`${selectedPledge === id ? 'active' : ''}`]}
              `}
            >
              <span className={styles['status-dot']}></span>
              <span className={styles['name']}>{name}</span>
              <span className={styles['strike-count']}>{strikes}</span>
            </div>
          ))}

          {pledges.length === 0 &&
            <div className={styles['empty-roster']}>
              <i className="fa-solid fa-user-group"></i>
              <span>No pledges yet</span>
            </div>
          }
        </div>

        <div className={styles['sidebar-actions']}>
          <Link
            href="/links"
            className={styles['links-btn']}
          >
            <i className="fa-solid fa-link"></i>
            <span>Links</span>
          </Link>

          {(user.role === 'ADMIN' || user.role === 'OWNER') &&
            <Link
              href="/users"
              className={styles['users-btn']}
            >
              <i className="fa-solid fa-tachograph-digital"></i>
              <span>Members</span>
            </Link>
          }

          <Link
            href="/requirements"
            className={styles['reqs-btn']}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Requirements</span>
          </Link>
        </div>
      </div>

      <button
        onClick={() => setShowSideBar(true)}
        className={styles['open-sidebar']}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

    </>
  );
}
