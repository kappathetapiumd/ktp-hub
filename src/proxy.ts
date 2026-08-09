import { NextRequest, NextResponse } from 'next/server';

import { getUserFromSession, updateUserSessionExpiration } from '@/lib/auth/session';

// pledges - GET
// weeks - GET
// strikes - GET (pledges - only total and total per week)
// requirements - GET
// requirements/pledge - GET
// links - GET
// pusher/auth - POST
const pledgePcpBrotherRoutes = [
  '/home', '/strikes', '/requirements', '/links', '/api/strikes', '/api/pledges',
  '/api/weeks', '/api/requirements', '/api/requirements/pledge', '/api/links',
  '/api/pusher/auth'
];

// strikes - POST, PUT, DELETE
const membershipRoutes = [...pledgePcpBrotherRoutes];

// users - GET, PUT, DELETE
// requirements - PUT, DELETE
// links - POST, DELETE
const adminRoutes = [...membershipRoutes, '/users', '/api/users'];

// weeks - POST
// users/deleted - GET, PUT, DELETE
// requirements/pledge - POST, PUT, DELETE
const ownerRoutes = [...adminRoutes, '/users/deleted', '/api/users/deleted'];

const REDIRECT_COOKIE = 'redirect-path';
const DEFAULT_REDIRECT = '/home';

export async function proxy(request: NextRequest) {
  const response = await proxyAuth(request);

  await updateUserSessionExpiration(request, response);

  return response;
}

async function proxyAuth(request: NextRequest) {
  const user = await getUserFromSession(request.cookies);
  const path = request.nextUrl.pathname;
  const apiCall = path.startsWith('/api');
  const loginPage = path === '/'
    || path === '/forgot-password' || path === '/reset-password';
  const limboPage = path === '/limbo';
  const authErrorPage = limboPage && request.nextUrl.searchParams.has('message');

  if (path.startsWith('/api/auth'))
    return NextResponse.next();

  if (!user) {
    if (apiCall)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!loginPage && !authErrorPage)
      return NextResponse.redirect(new URL('/', request.url));

    return NextResponse.next();
  }

  if (user.role === 'NONE') {
    if (apiCall)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    if (loginPage || limboPage)
      return NextResponse.next();

    return NextResponse.redirect(new URL('/limbo', request.url));
  }

  const savedPath =
    request.cookies.get(REDIRECT_COOKIE)?.value ?? DEFAULT_REDIRECT;

  if (loginPage || limboPage) {
    return NextResponse.redirect(new URL(savedPath, request.url));
  }

  let response;

  if (user.role === 'OWNER')
    response = ownerAuth(path, apiCall, request);

  else if (user.role === 'ADMIN')
    response = adminAuth(path, apiCall, request);

  else if (user.membershipCommittee)
    response = membershipAuth(path, apiCall, request);

  else if (user.role === 'PLEDGE' || user.role === 'PCP_PCVP'
    || user.role === 'BROTHER')
    response = brotherPcpAuth(path, apiCall, request);

  else return deny('/', apiCall, request);

  if (!apiCall && !response.headers.has('location')) {
    response.cookies.set(REDIRECT_COOKIE, path, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });
  }

  return response;
}

function brotherPcpAuth(
  path: string, apiCall: boolean, request: NextRequest
) {
  if (!pledgePcpBrotherRoutes.includes(path))
    return deny('/home', apiCall, request);

  if (apiCall && path !== '/api/pusher/auth' && request.method !== 'GET')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.next();
}

function membershipAuth(
  path: string, apiCall: boolean, request: NextRequest
) {
  if (!membershipRoutes.includes(path))
    return deny('/home', apiCall, request);

  if ((path === '/api/weeks' || path.startsWith('/api/requirements')
    || path === '/api/links') && request.method !== 'GET'
  )
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.next();
}

function adminAuth(
  path: string, apiCall: boolean, request: NextRequest
) {
  if (!adminRoutes.includes(path))
    return deny('/home', apiCall, request);

  if ((path === '/api/weeks' || path === '/api/requirements/pledge')
    && request.method !== 'GET'
  )
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.next();
}

function ownerAuth(
  path: string, apiCall: boolean, request: NextRequest
) {
  if (!ownerRoutes.includes(path))
    return deny('/home', apiCall, request);

  return NextResponse.next();
}

function deny(
  redirect: string, apiCall: boolean, request: NextRequest
) {
  if (apiCall)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.redirect(new URL(redirect, request.url));
}

export const config = {
  matcher : [
    // skip next js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'
  ]
}
