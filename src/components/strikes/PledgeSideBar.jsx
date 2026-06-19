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

export default function PledgeSideBar() {
  return (
    <div className={styles['sidebar']}>
      <div className={styles['header']}>
        <h1 className={styles['total-strikes']}>
          <span>Total Strikes:</span>
          <span className={`${styles['total-count']} 
            ${totalStrikes < 10 ? styles['single-digit'] : ''}`}
          >{totalStrikes}</span>
        </h1>
        <button className={styles["close-nav"]}>
          <i className={styles["fa-solid fa-xmark"]}></i>
        </button>
      </div>

      <div className={styles["pledge-list"]}>
        {pledges.map(({ name, strikes }) => {
          return (
            <div key={name} className={`${styles['pledge-card']} 
              ${styles[`${strikes >= 6 ? 'red' : strikes >= 3 ? 'yellow' : 'green'}`]}`}
            >
              <span className={styles["name"]}>{name}</span>
              <span className={styles["strike-count"]}>{strikes}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
