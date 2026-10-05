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
    event('before-week', '2026-09-27T23:59:59.999', 8),
    event('start', '2026-09-28T00:00:00', 1),
    event('last-day', '2026-10-04T15:30:00', 2),
    event('last-millisecond', '2026-10-04T23:59:59.999', -1),
    event('next-week', '2026-10-05T00:00:00', 4),
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
    'pledge-id', '9/28/26 - 10/04/26'
  );

  assert.deepEqual(Array.from(strikeHistory, ({ reason }) => reason), [
    'Reason for start',
    'Reason for last-day',
    'Reason for last-millisecond',
  ]);
  assert.equal(totalStrikesPerWeek, 2);
});
