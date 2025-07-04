"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken");
    const accessToken = localStorage.getItem("userToken");

    const publicRoutes = [
      "/register",
      "/forgot-password",
      "/register-success",
      "/change-password",
      "/signin",
      "/request-token",
      "/tenant/login",
    ];

    const isPublic =
      publicRoutes.includes(pathname) ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api");

    if (
      !refreshToken &&
      !accessToken &&
      !publicRoutes.includes(pathname) &&
      !isPublic
    ) {
      router.push("/");
    }
  }, [router, pathname]);

  return <>{children}</>;
}
