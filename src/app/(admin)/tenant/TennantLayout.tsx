"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SidebarTennantProvider,
  useSidebarTennant,
} from "@/context/SidebarTennantContext";
import AppSidebarTennant from "@/layout/AppSidebarTennant";
import Backdrop from "@/layout/Backdrop";
import Cookies from "js-cookie";

export default function TennantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebarTennant();
  const router = useRouter();
  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  useEffect(() => {
    let token: string | undefined = undefined;

    // 1. Cek di localStorage
    if (typeof window !== "undefined") {
      token = localStorage.getItem("userToken") || undefined;
    }

    // 2. Kalau tidak ada di localStorage, cek di Cookies
    if (!token) {
      token = Cookies.get("userToken");
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          console.warn("Token expired");

          // Hapus dari localStorage dan cookie
          localStorage.removeItem("userToken");
          Cookies.remove("userToken");

          router.replace("/signin");
        }
      } catch (err) {
        console.error("Token invalid atau corrupt", err);

        localStorage.removeItem("userToken");
        Cookies.remove("userToken");

        router.replace("/signin");
      }
    } else {
      console.warn("Token tidak ditemukan di localStorage atau cookie");
      router.replace("/signin");
    }
  }, [router]);
  return (
    <SidebarTennantProvider>
      <div className="min-h-screen xl:flex">
        <AppSidebarTennant />
        <Backdrop />
        <div
          className={`w-full flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <div
            className="mx-auto max-w-[var(--breakpoint-xl)] p-4 md:p-6"
            style={{ "--breakpoint-xl": "1400px" } as React.CSSProperties}
          >
            {children}
          </div>
        </div>
      </div>
    </SidebarTennantProvider>
  );
}
