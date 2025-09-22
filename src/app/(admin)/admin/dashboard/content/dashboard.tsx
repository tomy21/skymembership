"use client";
import DonutChart from "@/components/ecommerce/DounutChart";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [listYear, setListYear] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1); // bulan 0-11, jadi +1
    const currentYear = String(now.getFullYear());
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    const fetchDataYear = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/year-transaction");
        setListYear(response.data.data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataYear();
  }, []);

  if (isLoading) return <div className="dark:text-white">Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <>
      <div className="-mt-3 flex flex-wrap items-center justify-between gap-3 p-3">
        {/* Input Search */}
        <div className="flex w-full flex-row items-center justify-end space-x-2">
          {/* Month & Year Filter */}
          {/* <div className="text-sm">
            <p className="text-gray-500 dark:text-white">
              Data dari tanggal 26 sampai 25
            </p>
          </div> */}
          <div className="flex flex-row items-center gap-2">
            <select
              className="rounded-md border p-2 text-gray-500 dark:bg-gray-500 dark:text-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              className="rounded-md border p-2 text-gray-500 dark:bg-gray-500 dark:text-white"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {listYear.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          {isLoading && <div>Loading...</div>}
          <EcommerceMetrics month={selectedMonth} year={selectedYear} />

          {/* <MonthlySalesChart /> */}
        </div>

        <div className="col-span-8">
          <StatisticsChart />
        </div>

        <div className="col-span-4">
          <DonutChart month={selectedMonth} year={selectedYear} />
        </div>

        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
