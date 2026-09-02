"use client";
import React, { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";
import axios from "axios";
import { ScaleLoader } from "react-spinners";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const [categories, setCategories] = useState<string[]>([
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]);
  const [seriesValue, setSeriesValue] = useState<number[]>([]);
  const [seriesRevenue, setSeriesRevenue] = useState<number[]>([]);
  const [tabValue, setTabValue] = useState<"day" | "month" | "year">("month");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/dashboard-static", {
        params: {
          range: tabValue,
        },
      });

      setCategories(response.data.categories);
      setSeriesValue(response.data.series[0].data);
      setSeriesRevenue(response.data.series[1].data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const options: ApexOptions = {
    legend: {
      show: false, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Define line colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "smooth", // Define the line style (straight, smooth, or step)
      width: [2, 2], // Line width for each dataset
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: categories,
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: [
      {
        title: {
          text: "Transactions",
        },
        labels: {
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Revenue (Rp)",
        },
        labels: {
          formatter: function (val) {
            return `Rp${val.toLocaleString("id-ID")}`;
          },
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Transaction",
      data: seriesValue,
    },
    {
      name: "Revenue",
      data: seriesRevenue,
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="text-theme-xs mt-1 text-gray-500 dark:text-gray-400">
            Monthly total transactions (from the 1st to the last day of the
            month).
          </p>
        </div>
        <div className="flex w-full items-start gap-3 sm:justify-end">
          <ChartTab value={tabValue} onChange={setTabValue} />
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <div className="min-h-[310px] min-w-[1000px] xl:min-w-full">
          {isLoading ? (
            <div className="m-auto flex items-center justify-center">
              <ScaleLoader
                height={100}
                width={5}
                margin={2}
                color="#bbb"
                loading={true}
              />
            </div>
          ) : (
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              height={310}
            />
          )}
        </div>
      </div>
    </div>
  );
}
