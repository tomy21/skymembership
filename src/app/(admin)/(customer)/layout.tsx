"use client";
import ProtectedLayout from "@/app/(protected)/layout";
import DevToolsWarning from "@/components/DevToolsWarning";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import React from "react";
import { Toaster } from "sonner";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex min-h-screen w-full items-center justify-center bg-white sm:container sm:w-full md:container md:w-1/4 xl:flex">
      <ProtectedLayout>
        <DevToolsWarning />
        <ProgressBarProvider>{children}</ProgressBarProvider>
        <Toaster richColors position="top-right" duration={1000} />
      </ProtectedLayout>
    </div>
  );
}
