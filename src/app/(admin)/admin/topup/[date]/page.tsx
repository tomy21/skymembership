import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableTopupDetail from "../content/TableDetail";

export const metadata: Metadata = {
  title: "Payment Topup | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb
        pageTitle="Detail Topup"
        prevPageTitle="Topup"
        prevPageUrl="/admin/topup"
      />
      <TableTopupDetail />
    </Suspense>
  );
}
