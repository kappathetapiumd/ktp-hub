import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { NextRequest, NextResponse } from 'next/server.js';

function load(path, dependencies) {
  const exports = {};
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, {
    exports, Date, URL, process,
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  return exports;
}

function setup({ remaining = 2 * 86400000, role = 'BROTHER', count = 1 } = {}) {
  const calls = [];
  const session = remaining === null ? null : {
    userId: 'real-user', role, membershipCommittee: false,
    expiresAt: new Date(Date.now() + remaining),
  };
  const auth = load('../src/lib/auth/session.ts', {
    crypto: {},
    '../prisma': { default: { session: {
      async findUnique() { calls.push('lookup'); return session; },
      async updateMany({ where }) {
        calls.push('renew');
        assert.equal(where.expiresAt, session.expiresAt);
        return { count };
      },
      async deleteMany() { throw new Error('Cleanup on normal request'); },
    } } },
  });
  const proxy = load('../src/proxy.ts', {
    'next/server': { NextRequest, NextResponse },
    '@/lib/auth/session': auth,
  }).proxy;
  const request = (path, cookie = true, method = 'GET') => new NextRequest(`https://example.com${path}`, {
    method,
    headers: {
      ...(cookie ? { cookie: 'session-id=valid-id' } : {}),
      [auth.USER_SESSION_HEADER]: JSON.stringify({ userId: 'attacker', role: 'OWNER' }),
    },
  });
  return { proxy, request, auth, calls };
}

test('one lookup forwards the real identity; downstream user lookup does not hit DB', async () => {
  const { proxy, request, auth, calls } = setup();
  const response = await proxy(request('/home'));
  const identity = response.headers.get(`x-middleware-request-${auth.USER_SESSION_HEADER}`);
  assert.equal(JSON.parse(identity).userId, 'real-user');
  assert.equal(response.headers.get(auth.USER_SESSION_HEADER), null);
  assert.equal(response.cookies.get('session-id'), undefined);
  const current = load('../src/lib/auth/currentUser.ts', {
    react: { cache: fn => fn },
    'next/headers': { headers: async () => new Headers({ [auth.USER_SESSION_HEADER]: identity }) },
    './session': auth,
  });
  assert.equal((await current.getCurrentUser()).userId, 'real-user');
  assert.deepEqual(calls, ['lookup']);
});

test('renewal only writes near expiration and does not recreate revoked sessions', async () => {
  for (const count of [0, 1]) {
    const { proxy, request, calls } = setup({ remaining: 3600000, count });
    const response = await proxy(request('/home'));
    assert.deepEqual(calls, ['lookup', 'renew']);
    assert.equal(Boolean(response.cookies.get('session-id')), count === 1);
  }
});

test('expired and missing sessions are denied without cleanup or renewal', async () => {
  for (const remaining of [-1000, null]) {
    const { proxy, request, calls } = setup({ remaining });
    const response = await proxy(request('/api/pledges'));
    assert.equal(response.status, 401);
    assert.equal(response.cookies.get('session-id').value, '');
    assert.deepEqual(calls, ['lookup']);
  }
});

test('forged identity without cookie cannot access protected pages or APIs', async () => {
  const { proxy, request, calls } = setup();
  assert.equal((await proxy(request('/api/pledges', false))).status, 401);
  assert.equal((await proxy(request('/home', false))).headers.get('location'), 'https://example.com/');
  assert.deepEqual(calls, []);
});

test('public auth endpoints clear caller identity without session queries', async () => {
  const { proxy, request, calls, auth } = setup();
  const response = await proxy(request('/api/auth/signin', true, 'POST'));
  assert.equal(response.headers.get(`x-middleware-request-${auth.USER_SESSION_HEADER}`), null);
  assert.deepEqual(calls, []);
});

test('role and method restrictions still apply', async () => {
  for (const [role, path, method, status] of [
    ['BROTHER', '/api/users', 'GET', 403],
    ['BROTHER', '/api/strikes', 'POST', 403],
    ['BROTHER', '/api/pusher/auth', 'POST', 200],
    ['ADMIN', '/api/weeks', 'POST', 403],
    ['OWNER', '/api/weeks', 'POST', 200],
    ['NONE', '/api/pledges', 'GET', 403],
  ]) {
    const { proxy, request, calls } = setup({ role });
    assert.equal((await proxy(request(path, true, method))).status, status);
    assert.deepEqual(calls, ['lookup']);
  }
});
