import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ['id', 'en'];
const defaultLocale = 'id';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Cek apakah URL sudah memiliki bahasa (contoh: /id/dosis atau /en/dosis)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Jika tidak ada bahasa di URL, arahkan ke default bahasa (id)
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Lewati path internal Next.js dan file statis
    '/((?!_next/static|_next/image|favicon.ico|api|images).*)',
  ],
};