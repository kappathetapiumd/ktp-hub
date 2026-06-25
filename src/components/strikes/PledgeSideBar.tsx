import { useRouter } from 'next/navigation';
import styles from './PledgeSideBar.module.css';
import type { Pledge } from '@/lib/pledges';

type Props = {
  pledges: Pledge[];
  totalStrikes: number;
  selectedPledge: string;
  setSelectedPledge: React.Dispatch<React.SetStateAction<string>>;
  showSideBar: boolean;
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PledgeSideBar(
  { pledges, totalStrikes, selectedPledge, setSelectedPledge, showSideBar, setShowSideBar }: Props
) {
  const router = useRouter();
  
  return (
    <>
      <div className={`${styles['sidebar']} ${!showSideBar ? styles['hide-bar'] : ''}`}>
        <div className={styles['header']}>
          <h1 className={styles['total-strikes']}>
            <span>Total Strikes:</span>
            <span className={`${styles['total-count']} 
              ${totalStrikes < 10 ? styles['single-digit'] : ''}`}
            >{totalStrikes}</span>
          </h1>
          <button
            onClick={() => setShowSideBar(false)}
            className={styles["close-sidebar"]}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className={styles["pledge-list"]}>
          {pledges.map(({ id, name, strikes }) => (
            <div
              onClick={() => setSelectedPledge(id)}
              key={id}
              className={`
                ${styles['pledge-card']} 
                ${styles[`${strikes >= 6 ? 'red' : strikes >= 3 ? 'yellow' : 'green'}`]}
                ${styles[`${selectedPledge === id ? 'active' : ''}`]}
              `}
            >
              <span className={styles["name"]}>{name}</span>
              <span className={styles["strike-count"]}>{strikes}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowSideBar(true)}
        className={styles['open-sidebar']}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <button
        onClick={() => router.push('/users')}
        className={styles['users-btn']}
      >
        <i className="fa-solid fa-tachograph-digital"></i>
      </button>
    </>
  );
}
