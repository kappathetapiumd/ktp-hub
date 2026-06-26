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
    omit: {
      pledgeId: true,
      createdById: true,
      amount: true,
      reason: true
    },
    include: {
      createdBy: {
        select: { name: true }
      }
    }
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
    omit: { pledgeId: true },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: { name: true }
      }
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
  const deletedStrike = await prisma.strikeEvent.delete({
    where: { id },
    select: { amount: true }
  });

  return deletedStrike;
}

export async function updateStrike(id: string, amount: number, reason: string) {
  await prisma.strikeEvent.updateMany({
    where: { id },
    data: {
      amount,
      reason
    }
  });
}
