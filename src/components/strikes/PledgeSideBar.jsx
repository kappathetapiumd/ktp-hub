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

const totalStrikes = 0;

// I moved onto developing the UI for a side bar that will contain all the pledges and each of their total counts, plus a cumulative count of all their strikes

export default function PledgeSideBar() {
  return (
    <>
      <div>
        <h1>Total Count: {strikes}</h1>
      </div>
      <div className="pledge-class-container">
        {pledges.map(({name, strikes}) => {
          return(
            <div className="pledge-container">
              <span className="name">{name}</span>
              <span className="strike-count">{strikes}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
