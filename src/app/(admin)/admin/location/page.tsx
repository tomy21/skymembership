import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableLocation from "./content/TableLocation";

export const metadata: Metadata = {
  title: "Location | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Locations" />
      <TableLocation />
    </Suspense>
  );
}
