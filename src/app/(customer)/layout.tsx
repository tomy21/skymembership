"use client";
import ProtectedLayout from "@/app/(protected)/layout";
import DevToolsWarning from "@/components/DevToolsWarning";
import ProgressBarProvider from "@/components/ProgressBarProvider";
import { AuthProvider } from "@/context/AuthContext";
import { PurchaseProvider } from "@/context/PurchaseContext";
import { TopupProvider } from "@/context/TopupContext";
import QueryProvider from "@/provider/QueryProvider";
import React from "react";
import { Toaster } from "sonner";
import { PaymentProvider } from "@/context/PaymentContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex min-h-screen w-full items-center justify-center bg-white sm:container sm:w-full md:container md:w-1/4 xl:flex">
      <AuthProvider>
        <QueryProvider>
          <PaymentProvider>
            <TopupProvider>
              <PurchaseProvider>
                <ProtectedLayout>
                  <DevToolsWarning />
                  <ProgressBarProvider>{children}</ProgressBarProvider>
                  <Toaster richColors position="top-right" duration={1000} />
                </ProtectedLayout>
              </PurchaseProvider>
            </TopupProvider>
          </PaymentProvider>
        </QueryProvider>
      </AuthProvider>
    </div>
  );
}
