import type { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import Dashboard from "./content/dashboard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Dashboard | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Ecommerce() {
  return (
    <Suspense fallback={<Loading />}>
      <PageBreadcrumb pageTitle="Dashboard" />
      <Dashboard />
    </Suspense>
  );
}
