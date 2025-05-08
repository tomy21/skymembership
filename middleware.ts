import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken');

  // URL yang ingin kamu proteksi
  const protectedRoutes = ['/*'];

  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Tentukan route mana saja yang middleware-nya aktif
export const config = {
  matcher: ['/:path*'], // sesuaikan
};
