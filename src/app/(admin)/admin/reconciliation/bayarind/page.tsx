import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableRecon from "../table/tableRecon";

export const metadata: Metadata = {
  title: "Reconsiliasi | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Reconsiliasi Bayarind" />
      <TableRecon bankName={"BAYARIND_BCA_VIRTUAL_ACCOUNT"} />
    </Suspense>
  );
}
