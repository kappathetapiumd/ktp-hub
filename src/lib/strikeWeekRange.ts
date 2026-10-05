// Resolve calendar labels in the browser, matching the displayed strike dates.
export function getStrikeWeekRange(week: string) {
  const [start, end] = week.split(' - ');
  const parse = (label: string) => {
    const [month, day, year] = label.split('/').map(Number);
    return new Date(year < 100 ? 2000 + year : year, month - 1, day);
  };
  const startDate = parse(start);
  const endDate = parse(end);
  // Advance a calendar day rather than 24 hours to account for DST.
  endDate.setDate(endDate.getDate() + 1);
  return { start: startDate.toISOString(), end: endDate.toISOString() };
}
