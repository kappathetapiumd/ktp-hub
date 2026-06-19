import './StrikeHistory.modules.css';

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
    <div className="strike-history-container">
      <h1 className="week-amount">
        Strikes: <span>{totalAmount > 0 ? `+${totalAmount}` : totalAmount}</span>
      </h1>

      <div className="horizontal-line"></div>

      {strikes.map(({ amount, reason, name, date }) => {
        return (
          <div
            key={`${name}-${date}`}
            className={
              `strike-card ${amount > 0 ? 'added' : 'removed'}`
            }
          >
            <div className="strike-event">
              <p className="amount">
                {amount > 0 ? `+${amount}` : amount}
              </p>

              <div className="vertical-line"></div>

              <div className="strike-content">
                <p className="reason">{reason}</p>

                <div className="footer">
                  <div className="update-btns">
                    <button className="delete-btn">Delete</button>
                    <button className="edit-btn">Edit</button>
                  </div>

                  <div className="meta">
                    <span className="name">{name}</span>
                    <span className="date">{date}</span>
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
