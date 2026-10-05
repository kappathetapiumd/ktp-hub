import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the history query without connecting to the production database.
const source = readFileSync(new URL('../src/lib/strikes.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
});

test('reloaded history retains reasons through the final day of a week', async () => {
  const event = (id, date, amount) => ({
    id,
    amount,
    reason: `Reason for ${id}`,
    createdAt: new Date(date),
    createdBy: { name: 'Committee member' },
    createdById: 'committee-id',
  });
  const events = [
    event('before-week', '2026-09-27T23:59:59.999-04:00', 8),
    event('start', '2026-09-28T00:00:00-04:00', 1),
    event('last-day', '2026-10-04T22:30:00-04:00', 2),
    event('last-millisecond', '2026-10-04T23:59:59.999-04:00', -1),
    event('next-week', '2026-10-05T00:00:00-04:00', 4),
  ];
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    Date,
    require: (name) => {
      assert.equal(name, './prisma');
      return { default: { strikeEvent: { findMany: async ({ where }) => {
        assert.equal(where.pledgeId, 'pledge-id');
        const { gte, lt, lte } = where.createdAt;
        return events.filter(({ createdAt }) =>
          createdAt >= gte && (lt ? createdAt < lt : createdAt <= lte)
        );
      } } } };
    },
  });

  const { strikeHistory, totalStrikesPerWeek } = await exports.getStrikeHistory(
    'pledge-id', new Date('2026-09-28T04:00:00Z'), new Date('2026-10-05T04:00:00Z')
  );

  assert.deepEqual(Array.from(strikeHistory, ({ reason }) => reason), [
    'Reason for start',
    'Reason for last-day',
    'Reason for last-millisecond',
  ]);
  assert.equal(totalStrikesPerWeek, 2);
});

const rangeSource = readFileSync(new URL('../src/lib/strikeWeekRange.ts', import.meta.url), 'utf8');
const rangeExports = {};
vm.runInNewContext(ts.transpileModule(rangeSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: rangeExports, Date });

test('browser week boundaries include the last day across DST changes', () => {
  const originalTimezone = process.env.TZ;
  process.env.TZ = 'America/New_York';
  try {
    for (const [week, start, end] of [
      ['9/28/26 - 10/04/26', '2026-09-28T04:00:00.000Z', '2026-10-05T04:00:00.000Z'],
      ['10/26/26 - 11/01/26', '2026-10-26T04:00:00.000Z', '2026-11-02T05:00:00.000Z'],
      ['3/02/26 - 3/08/26', '2026-03-02T05:00:00.000Z', '2026-03-09T04:00:00.000Z'],
    ]) {
      const range = rangeExports.getStrikeWeekRange(week);
      assert.equal(range.start, start);
      assert.equal(range.end, end);
    }
  } finally {
    if (originalTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimezone;
  }
});
