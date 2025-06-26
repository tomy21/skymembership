import { Metadata } from "next";
import React, { Suspense } from "react";
import PaymentProcess from "../../(customer)/(ui-elements)/payment-process/PaymentProcess";
import Loading from "@/components/Loading/Loading";

export const metadata: Metadata = {
  title: "Payment | SKY Parking",
  description: "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative mx-auto min-h-screen w-sm bg-white">
        <PaymentProcess />
      </div>
    </Suspense>
  );
}
