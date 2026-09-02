"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";

const SIDEBAR_EXPANDED = "lg:ml-[280px]";
const SIDEBAR_COLLAPSED = "lg:ml-[80px]";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const router = useRouter();

  const sidebarExpanded = isExpanded || isHovered;

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : sidebarExpanded
      ? SIDEBAR_EXPANDED
      : SIDEBAR_COLLAPSED;

  useEffect(() => {
    let token: string | undefined;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("userToken") || undefined;
    }

    if (!token) {
      token = Cookies.get("userToken");
    }

    if (!token) {
      router.replace("/signin");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("userToken");
        Cookies.remove("userToken");
        router.replace("/signin");
      }
    } catch {
      localStorage.removeItem("userToken");
      Cookies.remove("userToken");
      router.replace("/signin");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppSidebar />
      <Backdrop />

      <div
        className={`min-h-screen transition-[margin] duration-300 ease-in-out ${mainContentMargin} `}
      >
        <AppHeader />

        <main className="min-h-[calc(100vh-4rem)]">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
