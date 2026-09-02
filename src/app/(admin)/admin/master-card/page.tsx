import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableMasterCard from "./content/TableMasterCard";

export const metadata: Metadata = {
  title: "Master Card | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Master Card" />
      <TableMasterCard />
    </Suspense>
  );
}
