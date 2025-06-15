import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableDetailMembers from "./TableMembershipDetail";

export const metadata: Metadata = {
  title: "Membership | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb
        pageTitle="Detail Membership"
        prevPageTitle="Membership"
        prevPageUrl="/admin/list-membership"
      />
      <TableDetailMembers />
    </Suspense>
  );
}
