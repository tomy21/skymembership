"use client";

import DonutChart from "@/components/ecommerce/DounutChart";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import axios from "axios";
import { useEffect, useState } from "react";

const MONTHS = [
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
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [listYear, setListYear] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const now = new Date();

    setSelectedMonth(String(now.getMonth() + 1));
    setSelectedYear(String(now.getFullYear()));

    const fetchDataYear = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await axios.get("/api/year-transaction");

        setListYear(response.data.data ?? []);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataYear();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-red-500">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5">
      {/* Filter */}
      <div className="flex w-full justify-end">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 sm:w-[150px] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="">All Months</option>

            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 sm:w-[120px] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
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

      {/* Dashboard Grid */}
      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Metrics */}
        <section className="min-w-0 xl:col-span-12">
          <EcommerceMetrics month={selectedMonth} year={selectedYear} />
        </section>

        {/* Statistics */}
        <section className="min-w-0 xl:col-span-8">
          <StatisticsChart />
        </section>

        {/* Donut */}
        <section className="min-w-0 xl:col-span-4">
          <DonutChart month={selectedMonth} year={selectedYear} />
        </section>

        {/* Recent Orders */}
        <section className="min-w-0 xl:col-span-12">
          <RecentOrders />
        </section>
      </div>
    </div>
  );
}
