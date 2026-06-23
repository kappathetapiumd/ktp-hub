import prisma from "./prisma";

export type StrikeHistory = {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export async function addStrike(pledgeId: string, createdById: string, amount: number, reason: string) {
  await prisma.strikeEvent.create({
    data: {
      pledgeId,
      createdById,
      amount,
      reason
    }
  });

  return { pledgeId, createdById, amount, reason };
}

export async function getStrikeHistory(pledgeId: string, week: string) {
  const [start, end] = week.split(' - ');
  const startDate = new Date(start);
  const endDate = new Date(end);

  console.log(week);

  const strikeEvents = await prisma.strikeEvent.findMany({
    where: {
      pledgeId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: { createdBy: true }
  });

  const strikeHistory = strikeEvents.map((strike) => ({
    id: strike.id,
    amount: strike.amount,
    reason: strike.reason,
    createdAt: strike.createdAt,
    createdBy: strike.createdBy.name
  }))

  return strikeHistory;
}
