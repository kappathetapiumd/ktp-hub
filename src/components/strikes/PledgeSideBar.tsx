import { useEffect, useState } from 'react';
import styles from './PledgeSideBar.module.css';

const pledges = [{
  name: 'Rishi Sinu Pillai',
  strikes: 8
}, {
  name: 'Emma Kim',
  strikes: 3
}, {
  name: 'Kayal Saravanan',
  strikes: 2
}, {
  name: 'Eliakim St. Germain',
  strikes: 1
}, {
  name: 'Arshia Mamidanna',
  strikes: 1
}, {
  name: 'Arya Patel',
  strikes: 6
}, {
  name: 'Nimmesh Sharma',
  strikes: 5
}, {
  name: 'Devin Gaines',
  strikes: 0
}];

const totalStrikes = 10;

type Props = {
  activePledge: string,
  setActivePledge: React.Dispatch<React.SetStateAction<string>>
}

export default function PledgeSideBar({ activePledge, setActivePledge }: Props) {
  const [showSideBar, setShowSideBar] = useState(true);

  useEffect(() => {
    setActivePledge(pledges[0].name);
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
          {pledges.map(({ name, strikes }) => {
            return (
              <div
                onClick={() => setActivePledge(name)}
                key={name}
                className={`${styles['pledge-card']} 
                  ${styles[`${strikes >= 6 ? 'red' : strikes >= 3 ? 'yellow' : 'green'}`]}`
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
