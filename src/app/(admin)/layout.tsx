"use client";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import { AuthProvider } from "@/context/AuthContext";
import { PaymentProvider } from "@/context/PaymentContext";
import React from "react";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AuthProvider>
        <PaymentProvider>
          <ProgressBarProvider>{children}</ProgressBarProvider>
          <Toaster
            richColors
            position="top-right"
            duration={1000}
            style={{ zIndex: 99999 }}
          />
        </PaymentProvider>
      </AuthProvider>
    </div>
  );
}
