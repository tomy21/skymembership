/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { ApexOptions } from "apexcharts";
import { ScaleLoader } from "react-spinners";
import { format } from "date-fns";

// Disable SSR untuk ApexChart
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const DonutChart = ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  // const [totalRevenue, setTotalRevenue] = useState(0);
  const [range, setRange] = useState<{ start: string; end: string } | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthYear = `${year}-${month.padStart(2, "0")}`;
        const res = await axios.get("/api/dashboard-byproduct-name", {
          params: { month: monthYear },
        });

        const data = res.data.data || [];
        // setTotalRevenue(res.data.totalRevenue || 0);
        setRange(res.data.range || null);
        setLabels(data.map((item: any) => item.product_name ?? ""));
        setSeries(data.map((item: any) => item.totalRevenue ?? 0));
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLabels([]);
        setSeries([]);
        // setTotalRevenue(0);
        setRange(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  const options: ApexOptions = {
    chart: { type: "donut", fontFamily: "Inter, sans-serif" },
    labels,
    legend: {
      position: "bottom",
      fontSize: "13px",
      fontWeight: 400,
      labels: { colors: "#6B7280" },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#6B7280"],
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: -5,
              color: "#fff",
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: "bold",
              formatter: (val: string) => {
                const num = Number(val);
                return `Rp ${num.toLocaleString("id-ID")}`;
              },
              color: "#111827",
            },
            total: {
              show: true,
              label: "Total",
              color: "#6B7280",
              fontSize: "14px",
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0,
                );
                return `Rp ${sum.toLocaleString("id-ID")}`;
              },
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark", // background gelap
      style: {
        fontSize: "13px",
        // @ts-expect-error Apex type tidak kenal 'color'
        color: "#fff", // teks putih
      },
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString("id-ID")}`,
      },
    },
    stroke: { show: false },
    colors: [
      "#6366F1",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#3B82F6",
      "#8B5CF6",
      "#14B8A6",
      "#F97316",
    ],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-6 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header dengan summary */}
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-700 dark:text-white">
          Purchase by Product
        </h2>
        <div className="flex flex-wrap justify-between text-sm text-gray-500 dark:text-white/50">
          <span>
            {range
              ? `${format(new Date(range.start), "dd-MMM-yyyy")} s/d ${format(
                  new Date(range.end),
                  "dd-MMM-yyyy",
                )}`
              : "-"}
          </span>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="m-auto flex h-[260px] items-center justify-center text-gray-400">
          <ScaleLoader height={80} width={4} margin={2} color="#bbb" />
        </div>
      ) : !series.length || !labels.length ? (
        <div className="m-auto flex h-[260px] items-center justify-center text-gray-400">
          No data available
        </div>
      ) : (
        <ApexChart
          options={options}
          series={series}
          type="donut"
          height={345}
        />
      )}
    </div>
  );
};

export default DonutChart;
