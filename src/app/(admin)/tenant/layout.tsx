"use client";
import ProtectedLayout from "@/app/(protected)/layout";
import DevToolsWarning from "@/components/DevToolsWarning";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import React from "react";
import { Toaster } from "sonner";
import HomeHeader from "./components/HomeHeader";
import { usePathname } from "next/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith("/tenant/login");
  return (
    <div className={`w-full transition-all duration-300 ease-in-out`}>
      <ProtectedLayout>
        <DevToolsWarning />
        <ProgressBarProvider>
          {hideHeader ? null : <HomeHeader />}
          <main>{children}</main>
        </ProgressBarProvider>
        <Toaster richColors position="top-right" duration={1000} />
      </ProtectedLayout>
    </div>
  );
}
