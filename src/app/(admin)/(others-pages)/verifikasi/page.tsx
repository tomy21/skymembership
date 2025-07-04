import { Metadata } from "next";
import React, { Suspense } from "react";
import PinVerify from "../../(customer)/(ui-elements)/pin-verifikasi/PinVerify";
import Loading from "@/components/Loading/Loading";
import HeaderPage from "@/components/header-page/page";

export const metadata: Metadata = {
  title: "Verifikasi | SKY Parking",
  description: "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative mx-auto min-h-screen w-full bg-white sm:w-sm">
        <HeaderPage title="Verifikasi" />
        <PinVerify />
      </div>
    </Suspense>
  );
}
