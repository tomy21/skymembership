import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableDetailTennant from "../../context/TableDetailsTennant";

export const metadata: Metadata = {
  title: "Tenant | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb
        pageTitle="Tenant Management Details"
        prevPageTitle="Tenant Management"
        prevPageUrl="/admin/b2b/list-members"
      />
      <TableDetailTennant />
    </Suspense>
  );
}
