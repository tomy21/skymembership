import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableTransaction from "../list-members/context/TableTransaction";

export const metadata: Metadata = {
  title: "Tenant | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Tenant Management" />
      <TableTransaction />
    </Suspense>
  );
}
