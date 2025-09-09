import HeaderPage from "@/components/header-page/page";
import { Metadata } from "next";
import React, { lazy, Suspense } from "react";
import Loading from "@/components/Loading/Loading";

export const metadata: Metadata = {
  title: "Extend Membership | SKY Membership",
  description: "Extend your membership product",
  // other metadata
};

const ExtendMembership = lazy(
  () => import("../../(ui-elements)/extendMembership/extendMembership"),
);

export default function page() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative mx-auto min-h-screen w-full bg-white sm:w-sm">
        <HeaderPage title="Detail Card" />
        <ExtendMembership />
      </div>
    </Suspense>
  );
}
