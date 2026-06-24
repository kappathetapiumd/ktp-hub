import prisma from './prisma';
import dayjs from 'dayjs';

export async function createStrikeTerm(startDate: string, endDate: string) {
  const strikeTerm = await prisma.$transaction(async (tx) => {
    await tx.strikeTermConfig.updateMany({
      where: { active: true },
      data: { active: false }
    });

    const strikeTerm = await tx.strikeTermConfig.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    return strikeTerm;
  });

  return strikeTerm;
}

export async function getWeeks() {
  const strikeTerm = await prisma.strikeTermConfig.findFirst({
    where: { active: true }
  });

  if (!strikeTerm) return;

  const { startDate, endDate } = strikeTerm;
  const weeks = generateWeeks(startDate, endDate);

  return weeks;
}

function generateWeeks(startDate: Date, endDate: Date) {
  const weeks = [];

  let currentStart = dayjs(startDate).add(1, 'day');
  const finalDate = dayjs(endDate).add(1, 'day');

  while (currentStart.isBefore(finalDate) || currentStart.isSame(finalDate)) {
    const weekEnd = currentStart.add(6, 'day');
    const currentEnd = weekEnd.isAfter(finalDate) ? finalDate : weekEnd;

    weeks.push(
      `${currentStart.format('M/DD/YY')} - ${currentEnd.format('M/DD/YY')}`
    );

    currentStart = currentStart.add(7, 'day');
  }

  return weeks;
}
