import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableMembership from "./content/tableMembership";

export const metadata: Metadata = {
  title: "Membership | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Ecommerce() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Membership" />
      <TableMembership />
    </Suspense>
  );
}
