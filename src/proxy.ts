import { NextRequest, NextResponse } from 'next/server';

import { getUserFromSession, updateUserSessionExpiration } from '@/lib/auth/session';

// pledges - GET
// weeks - GET
// strikes - GET (pledges - only total and total per week)
// requirements - GET
const pledgePcpBrotherRoutes = [
  '/strikes', '/requirements', '/api/strikes',
  '/api/pledges', '/api/weeks', '/api/requirements'
];

// strikes - POST, PUT, DELETE
const membershipRoutes = [...pledgePcpBrotherRoutes];

// users - GET, PUT, DELETE
// requirements - PUT
const adminRoutes = [...membershipRoutes, '/users', '/api/users'];

// weeks - POST
// users/deleted - GET, PUT, DELETE
const ownerRoutes = [...adminRoutes, '/users/deleted', '/api/users/deleted'];

export async function proxy(request: NextRequest) {
  const response = await proxyAuth(request);

  await updateUserSessionExpiration(request, response);

  return response;
}

async function proxyAuth(request: NextRequest) {
  const user = await getUserFromSession(request.cookies);
  const path = request.nextUrl.pathname;
  const apiCall = path.startsWith('/api');
  const loginPage = path === '/';
  const limboPage = path === '/limbo';
  const authErrorPage = limboPage && request.nextUrl.searchParams.has('message');

  if (path === '/api/auth/signin' || path === '/api/auth/signup')
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

  if (loginPage || limboPage)
    return NextResponse.redirect(new URL('/strikes', request.url));

  if (user.role === 'OWNER')
    return ownerAuth(path, apiCall, request);

  if (user.role === 'ADMIN')
    return adminAuth(path, apiCall, request);

  if (user.membershipCommittee)
    return membershipAuth(path, apiCall, request);

  if (user.role === 'PLEDGE' || user.role === 'PCP_PCVP'
    || user.role === 'BROTHER')
    return brotherPcpAuth(path, apiCall, request);

  return deny('/', apiCall, request);
}

function brotherPcpAuth(
  path: string, apiCall: boolean, request: NextRequest
) {
  if (!pledgePcpBrotherRoutes.includes(path))
    return deny('/strikes', apiCall, request);

  if (apiCall && request.method !== 'GET')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.next();
}

function membershipAuth(
  path: string, apiCall: boolean, request: NextRequest
) {
  if (!membershipRoutes.includes(path))
    return deny('/strikes', apiCall, request);

  if ((path === '/api/weeks' || path === '/api/requirements')
    && request.method !== 'GET'
  )
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.next();
}

function adminAuth(
  path: string, apiCall: boolean, request: NextRequest
) {
  if (!adminRoutes.includes(path))
    return deny('/strikes', apiCall, request);

  if (path === '/api/weeks' && request.method !== 'GET')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.next();
}

function ownerAuth(
  path: string, apiCall: boolean, request: NextRequest
) {
  if (!ownerRoutes.includes(path))
    return deny('/strikes', apiCall, request);

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
