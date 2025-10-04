import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Check for authentication cookie
  const sessionCookie = request.cookies.get('appwrite-session');
  const isAuthenticated = !!sessionCookie;

  if (
    !isAuthenticated &&
    request.nextUrl.pathname !== '/login' &&
    request.nextUrl.pathname !== '/register'
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log(
    'Request page:',
    request.nextUrl.pathname,
    'Authenticated:',
    isAuthenticated,
  );

  return NextResponse.next();
}

export const config = {
  matcher: ['/bookings', '/rooms/add'],
};
