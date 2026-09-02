import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableCustomer from "../user-management/table/TableCustomer";

export const metadata: Metadata = {
  title: "Customer Management | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Customer Management" />
      <TableCustomer />
    </Suspense>
  );
}
