// https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/middleware.ts

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const i18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = i18nRouting(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // redirect authenticated users away from auth pages
  if (
    user &&
    (routing.locales.some(
      (locale) =>
        request.nextUrl.pathname === `/${locale}/login` ||
        request.nextUrl.pathname === `/${locale}/register`,
    ) ||
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/register')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // redirect unathenticated users away from authenticated pages
  if (
    !user &&
    (routing.locales.some((locale) => request.nextUrl.pathname === `/${locale}/history`) ||
      request.nextUrl.pathname === '/history')
  ) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(ja|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
