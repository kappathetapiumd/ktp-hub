type Pledge = {
  id: string,
  name: string,
  strikes: number
}

type renderPledgeListParams = {
  setPledges: React.Dispatch<React.SetStateAction<Array<Pledge>>>
}

export async function renderPledgeList(
  setPledges: React.Dispatch<React.SetStateAction<Array<Pledge>>>,
  setActivePledge: React.Dispatch<React.SetStateAction<string>>,
  setTotalStrikes: React.Dispatch<React.SetStateAction<number>>
) {
  const response = await fetch('/api/pledges');

  if (!response.ok) return;

  const pledges = await response.json();
  setPledges(pledges);
  setActivePledge(pledges[0].id);

  setTotalStrikes(pledges.reduce(
    (sum: number, pledge: Pledge) => sum + pledge.strikes,
    0
  ));
}

export async function updatePledgeList() {

}
