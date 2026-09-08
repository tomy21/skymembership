import FormValidationPurchase from "@/components/form/form-elements/FormValidationPurchase";
import HeaderPage from "@/components/header-page/page";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Purchase | SKY Membership",
  description: "Purchase your membership product",
  // other metadata
};

export default function FormValidationPurchasePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative mx-auto min-h-screen w-full bg-white">
        <HeaderPage title="Pembayaran" />
        <FormValidationPurchase />
      </div>
    </Suspense>
  );
}
