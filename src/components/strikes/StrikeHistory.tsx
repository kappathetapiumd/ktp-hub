import styles from './StrikeHistory.module.css';

const strikes = [{
  amount: 1,
  reason: "didn't follow up on pverma's interview again",
  name: "Nikhil Shyam",
  date: "03/22 • 11:35 PM"
}, {
  amount: 3,
  reason: "no visor",
  name: "Soumya Jailwala",
  date: "03/23 • 7:04 PM"
}, {
  amount: -1,
  reason: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut asperiores in enim vero sed aspernatur alias autem natus, saepe fuga cum ut pariatur dolorum magni optio officiis incidunt. Vitae, dolore?",
  name: "Aditya Hardikar",
  date: "03/27 • 10:10 AM"
}, {
  amount: 1,
  reason: "didn't follow up on vermaedit's interview again",
  name: "Nikhil Shyam",
  date: "03/29 • 4:36 PM"
}, {
  amount: 1,
  reason: "not following up with pratham again",
  name: "Amaar Trisal",
  date: "03/29 • 4:38 PM"
}]

const totalAmount = 5;

export default function StrikeHistory() {
  return (
    <div className={styles["strike-history-container"]}>
      <h1 className={styles["week-amount"]}>
        Strikes: <span>{totalAmount > 0 ? `+${totalAmount}` : totalAmount}</span>
      </h1>

      <div className={styles["horizontal-line"]}></div>

      {strikes.map(({ amount, reason, name, date }) => {
        return (
          <div
            key={`${name}-${date}`}
            className={
              `${styles['strike-card']} ${styles[`${amount > 0 ? 'added' : 'removed'}`]}`}
          >
            <div className={styles["strike-event"]}>
              <p className={styles["amount"]}>
                {amount > 0 ? `+${amount}` : amount}
              </p>

              <div className={styles["vertical-line"]}></div>

              <div className={styles["strike-content"]}>
                <p className={styles["reason"]}>{reason}</p>

                <div className={styles["footer"]}>
                  <div className={styles["update-btns"]}>
                    <button className={styles["delete-btn"]}>Delete</button>
                    <button className={styles["edit-btn"]}>Edit</button>
                  </div>

                  <div className={styles["meta"]}>
                    <span className={styles["name"]}>{name}</span>
                    <span className={styles["date"]}>{date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
