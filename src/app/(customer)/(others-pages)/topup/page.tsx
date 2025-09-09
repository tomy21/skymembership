import { Metadata } from "next";
import React, { Suspense } from "react";
import TopupPage from "../../(ui-elements)/topup-point/page";
import Loading from "@/components/Loading/Loading";

export const metadata: Metadata = {
  title: "Topup point | SKY Parking",
  description: "Parking Membership SKY PARKING",
};

export default function page() {
  return (
    <div className="mx-auto min-h-screen w-full space-y-2 bg-white sm:w-sm">
      <Suspense fallback={<Loading />}>
        <TopupPage />
      </Suspense>
    </div>
  );
}
