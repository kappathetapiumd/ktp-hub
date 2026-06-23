import prisma from './prisma';

export type Pledge = {
  id: string;
  name: string;
  strikes: number;
}

export async function getPledges() {
  const pledges = await prisma.user.findMany({
    where: { role: 'PLEDGE' },
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

  return pledgesWithTotals;
}
