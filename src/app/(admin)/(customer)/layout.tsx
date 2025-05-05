"use client";
import ProtectedLayout from "@/app/(protected)/layout";
import React from "react";
import { Toaster } from "sonner";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="min-h-screen xl:flex flex justify-center items-center w-full m-auto bg-white md:w-full sm:w-full md:container sm:container">
      <ProtectedLayout>
        {children}
        <Toaster richColors position="top-right" duration={1000} />
      </ProtectedLayout>
    </div>
  );
}
