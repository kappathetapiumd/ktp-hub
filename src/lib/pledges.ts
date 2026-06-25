import prisma from './prisma';

export type Pledge = {
  id: string;
  name: string;
  strikes: number;
}

export async function getPledges() {
  const pledges = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'PLEDGE' },
        { role: 'PCP_PCVP' }
      ],
      isActive: true
    },
    include: { pledgeStrikeEvents: true }
  });

  const pledgesWithTotals = pledges.map((pledge) => ({
    id: pledge.id,
    name: pledge.name,
    strikes: pledge.pledgeStrikeEvents.reduce(
      (sum, event) => sum + event.amount,
      0
    )
  }));

  pledgesWithTotals.sort((a, b) => {
    const aLastName = a.name.split(' ')[1];
    const bLastName = b.name.split(' ')[1];
    
    return aLastName.localeCompare(bLastName);
  })

  return pledgesWithTotals;
}
