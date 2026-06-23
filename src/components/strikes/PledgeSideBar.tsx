import { useEffect, useState } from 'react';
import styles from './PledgeSideBar.module.css';

type Props = {
  activePledge: string,
  setActivePledge: React.Dispatch<React.SetStateAction<string>>
}

type Pledge = {
  id: string,
  name: string,
  strikes: number
}

export default function PledgeSideBar({ activePledge, setActivePledge }: Props) {
  const [pledges, setPledges] = useState([]);
  const [totalStrikes, setTotalStrikes] = useState(0);
  const [showSideBar, setShowSideBar] = useState(true);

  useEffect(() => {
    getPledges();

    async function getPledges() {
      const response = await fetch('/api/pledges');

      if (!response.ok) return;

      const pledges = await response.json();
      setPledges(pledges);
      setActivePledge(pledges[0].id)

      setTotalStrikes(pledges.reduce(
        (sum: number, pledge: Pledge) => sum + pledge.strikes,
        0
      ));
    }
  }, []);

  return (
    <>
      <div className={`${styles['sidebar']} ${styles[`${!showSideBar ? 'hide-bar' : ''}`]}`}>
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
          {pledges.map(({ id, name, strikes }) => {
            return (
              <div
                onClick={() => setActivePledge(id)}
                key={id}
                className={`${styles['pledge-card']} 
                  ${styles[`${strikes >= 6 ? 'red' : strikes >= 3 ? 'yellow' : 'green'}`]}
                  ${styles[`${activePledge === id ? 'active' : ''}`]}`
                }
              >
                <span className={styles["name"]}>{name}</span>
                <span className={styles["strike-count"]}>{strikes}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setShowSideBar(true)}
        className={`${styles['open-sidebar']}`}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
    </>
  );
}
