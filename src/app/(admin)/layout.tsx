"use client";
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
          {children}
          <Toaster richColors position="top-right" duration={1000} />
        </PaymentProvider>
      </AuthProvider>
    </div>
  );
}
