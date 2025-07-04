"use client";
import ProtectedLayout from "@/app/(protected)/layout";
import DevToolsWarning from "@/components/DevToolsWarning";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import React from "react";
import { Toaster } from "sonner";
import HomeHeader from "./components/HomeHeader";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`w-full transition-all duration-300 ease-in-out`}>
      <ProtectedLayout>
        <DevToolsWarning />
        <ProgressBarProvider>
          <HomeHeader />
          <main>{children}</main>
        </ProgressBarProvider>
        <Toaster richColors position="top-right" duration={1000} />
      </ProtectedLayout>
    </div>
  );
}
