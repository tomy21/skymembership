import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React, { Suspense } from "react";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import Loading from "@/components/Loading/Loading";

export const metadata: Metadata = {
  title: "Dashboard | Admin - SKY Membership",
  description: "Admin SKY Membership",
};

export default function Ecommerce() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics />

          {/* <MonthlySalesChart /> */}
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>
        {/* 
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </Suspense>
  );
}
