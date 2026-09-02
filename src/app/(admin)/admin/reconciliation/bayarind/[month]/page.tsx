import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableReconPerMonth from "../../table/tableReconBayarindPerMonth";

export const metadata: Metadata = {
  title: "Membership | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb
        pageTitle="Detail Reconciliation Bayarind"
        prevPageTitle="Reconciliation Bayarind"
        prevPageUrl="/admin/reconciliation/bayarind"
      />
      <TableReconPerMonth bankName={"BAYARIND_BCA_VIRTUAL_ACCOUNT"} />
    </Suspense>
  );
}
