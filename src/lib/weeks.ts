import prisma from './prisma';

export async function createStrikeTerm(startDate: string, endDate: string) {
  const parsedStartDate = parseDateOnly(startDate);
  const parsedEndDate = parseDateOnly(endDate);

  if (parsedStartDate >= parsedEndDate)
    throw new RangeError('The term end date must be after its start date.');

  await prisma.$transaction(async (tx) => {
    const oldStrikeTerm = await tx.strikeTerm.findFirst({
      select: { id: true }
    });

    if (oldStrikeTerm !== null) {
      await tx.strikeEvent.deleteMany();
      await tx.strikeTerm.deleteMany();
    }

    await tx.strikeTerm.create({
      data: {
        startDate: parsedStartDate,
        endDate: parsedEndDate
      }
    });
  });
}

export async function getWeeks() {
  const strikeTerm = await prisma.strikeTerm.findFirst({
    omit: { id: true }
  });

  if (!strikeTerm) return [];

  const { startDate, endDate } = strikeTerm;
  const weeks = generateWeeks(startDate, endDate);

  return weeks;
}

function generateWeeks(startDate: Date, endDate: Date) {
  const weeks = [];

  let currentStart = startDate;

  while (currentStart <= endDate) {
    const weekEnd = addUtcDays(currentStart, 6);
    const currentEnd = weekEnd > endDate ? endDate : weekEnd;

    weeks.push(
      `${formatUtcDate(currentStart)} - ${formatUtcDate(currentEnd)}`
    );

    currentStart = addUtcDays(currentStart, 7);
  }

  return weeks;
}

function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new RangeError('Invalid date.');

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    throw new RangeError('Invalid date.');

  return date;
}

function addUtcDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function formatUtcDate(date: Date) {
  const month = date.getUTCMonth() + 1;
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = String(date.getUTCFullYear()).slice(-2);

  return `${month}/${day}/${year}`;
}
