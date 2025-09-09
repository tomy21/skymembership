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
        pageTitle="Detail Reconciliation Nobu"
        prevPageTitle="Reconciliation Nobu"
        prevPageUrl="/admin/reconciliation/nobu"
      />
      <TableReconPerMonth bankName={"BANK_NATIONAL_NOBU_VIRTUAL_ACCOUNT"} />
    </Suspense>
  );
}
