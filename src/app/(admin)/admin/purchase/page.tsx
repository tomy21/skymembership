import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TablePurchase from "./content/TablePurchase";

export const metadata: Metadata = {
  title: "Purchase | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Purchase Product" />
      <TablePurchase />
    </Suspense>
  );
}
