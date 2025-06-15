import React, { Suspense } from "react";
import { Metadata } from "next";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableHistoryPayment from "../table/tableHistoryPayment";

export const metadata: Metadata = {
  title: "History Transaction | Admin SKY Membership",
  description: "Aplikasi membership SKY Parking",
  // other metadata
};

export default function Page() {
  return (
    <div className="w-full">
      <Suspense fallback={<Loading />}>
        <PageBreadcrumb pageTitle="History Transaction" />
        <TableHistoryPayment />
      </Suspense>
    </div>
  );
}
