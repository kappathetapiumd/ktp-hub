import prisma from './prisma';

export type Strike = {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
  createdBy: string;
  createdById: string;
}

export async function addStrike(
  pledgeId: string, createdById: string, amount: number, reason: string
) {
  const { id, createdAt, createdBy } = await prisma.strikeEvent.create({
    data: {
      pledgeId,
      createdById,
      amount,
      reason
    },
    include: { createdBy: true }
  });

  return {
    id,
    amount,
    reason,
    createdAt: createdAt.toISOString(),
    createdBy: createdBy.name,
    createdById
  };
}

export async function getStrikeHistory(pledgeId: string, week: string) {
  const [start, end] = week.split(' - ');
  const startDate = new Date(start);
  const endDate = new Date(end);

  const strikeEvents = await prisma.strikeEvent.findMany({
    where: {
      pledgeId,
      createdAt: {
        gte: startDate,
        lte: endDate
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: true
    }
  });

  const strikeHistory = strikeEvents.map((strike) => ({
    id: strike.id,
    amount: strike.amount,
    reason: strike.reason,
    createdAt: strike.createdAt,
    createdBy: strike.createdBy.name,
    createdById: strike.createdById
  }))

  return strikeHistory;
}

export async function deleteStrike(id: string) {
  await prisma.strikeEvent.delete({
    where: { id }
  });
}

export async function updateStrike(id: string, amount: number, reason: string) {
  await prisma.strikeEvent.update({
    where: { id },
    data: {
      amount,
      reason
    }
  });
}
