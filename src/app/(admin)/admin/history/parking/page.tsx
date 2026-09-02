import React, { Suspense } from "react";
import { Metadata } from "next";
import Loading from "@/components/Loading/Loading";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TableHistoryParking from "../table/tableHistoryParking";

export const metadata: Metadata = {
  title: "History Parking | Admin SKY Membership",
  description: "Aplikasi membership SKY Parking",
  // other metadata
};

export default function Page() {
  return (
    <div className="w-full">
      <Suspense fallback={<Loading />}>
        <PageBreadcrumb pageTitle="History Parking" />
        <TableHistoryParking />
      </Suspense>
    </div>
  );
}
