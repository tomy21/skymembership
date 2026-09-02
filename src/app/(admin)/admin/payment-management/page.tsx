import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TablePaymentManagement from "./content/TablePaymentManagement";

export const metadata: Metadata = {
  title: "Purchase | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Payment Management" />
      <TablePaymentManagement />
    </Suspense>
  );
}
