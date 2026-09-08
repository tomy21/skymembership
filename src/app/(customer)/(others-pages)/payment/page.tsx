import { Metadata } from "next";
import { Suspense } from "react";
import PaymentProcess from "../../(ui-elements)/payment-process/PaymentProcess";

export const metadata: Metadata = {
  title: "Pembayaran | SKY Membership",
  description: "Pembayaran membership SKY Parking",
};

export default function FormValidationPurchasePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] text-sm text-slate-400">
          Memuat pembayaran...
        </div>
      }
    >
      <main className="min-h-screen bg-[#f7f8fa]">
        {/* <HeaderPage title="Pembayaran" /> */}
        <PaymentProcess />
      </main>
    </Suspense>
  );
}
