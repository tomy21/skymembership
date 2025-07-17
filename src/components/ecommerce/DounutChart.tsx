/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { ApexOptions } from "apexcharts";
import { ScaleLoader } from "react-spinners";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const monthYear = `${year}-${month.padStart(2, "0")}`;
        const res = await axios.get("/api/dashboard-byproduct-name", {
          params: { month: monthYear },
        });

        const data = res.data.data || [];
        setLabels(data.map((item: any) => item.product_name ?? ""));
        setSeries(data.map((item: any) => item.totalRevenue ?? 0));
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setLabels([]);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  const options: ApexOptions = {
    chart: {
      type: "donut" as const,
      fontFamily: "Inter, sans-serif",
    },
    labels,
    legend: {
      position: "bottom" as const,
      fontSize: "14px",
      fontWeight: 400,
      labels: {
        colors: "#6B7280",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return `${val.toFixed(1)}%`;
      },
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        color: "#000",
        opacity: 0.45,
      },
    },
    stroke: {
      show: false,
    },
    colors: [
      "#6366F1", // indigo-500
      "#10B981", // emerald-500
      "#F59E0B", // amber-500
      "#EF4444", // red-500
      "#3B82F6", // blue-500
      "#8B5CF6", // violet-500
      "#14B8A6", // teal-500
      "#F97316", // orange-500
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 280 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 ring-1 ring-gray-200 transition duration-300 hover:shadow-xl">
      <div className="flex flex-col items-start justify-start">
        <h2 className="text-start text-lg font-semibold text-gray-700">
          Purchase by Product
        </h2>
        <p className="text-start text-sm text-gray-500">
          Summary of purchase by product
        </p>
      </div>

      {loading ? (
        <div className="m-auto flex h-[348px] items-center justify-center text-center text-gray-400">
          <ScaleLoader
            height={100}
            width={5}
            margin={2}
            color="#bbb"
            loading={true}
          />
        </div>
      ) : !series.length || !labels.length ? (
        <div className="m-auto flex h-[348px] items-center justify-center text-center text-gray-400">
          No data available
        </div>
      ) : (
        <ApexChart
          options={options}
          series={series}
          type="donut"
          height={348}
        />
      )}
    </div>
  );
};

export default DonutChart;
