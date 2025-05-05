'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const refreshToken = Cookies.get('refreshToken');
    const publicRoutes = ['/register', '/forgot-password', '/register-success','/change-password']; // daftar halaman yang tidak perlu login

    if (!refreshToken && !publicRoutes.includes(pathname)) {
      router.push('/');
    }
  }, [router, pathname]);

  return <>{children}</>;
}
