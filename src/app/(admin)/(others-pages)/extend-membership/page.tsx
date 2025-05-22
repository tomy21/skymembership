import HeaderPage from "@/components/header-page/page";
import { Metadata } from "next";
import React, { Suspense } from "react";
import ExtendMembership from "../../(customer)/(ui-elements)/extendMembership/page";
import Loading from "@/components/Loading/Loading";

export const metadata: Metadata = {
  title: "Purchase | SKY Membership",
  description: "Purchase your membership product",
  // other metadata
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative min-h-screen w-full bg-white">
        <HeaderPage title="Detail Card" />
        <ExtendMembership />
      </div>
    </Suspense>
  );
}
