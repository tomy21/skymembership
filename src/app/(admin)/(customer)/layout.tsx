"use client";
import ProtectedLayout from "@/app/(protected)/layout";
import Loading from "@/components/Loading/Loading";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Toaster } from "sonner";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Loading />; // atau null
  }
  return (
    <div className="m-auto flex min-h-screen w-full items-center justify-center bg-white sm:container sm:w-full md:container md:w-full xl:flex">
      <ProtectedLayout>
        <ProgressBarProvider>{children}</ProgressBarProvider>
        <Toaster richColors position="top-right" duration={1000} />
      </ProtectedLayout>
    </div>
  );
}
