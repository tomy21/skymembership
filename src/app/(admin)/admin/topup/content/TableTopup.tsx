"use client";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/Loading/Loading";
import { FiEye } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface TopupResponse {
  tanggal: string;
  paid: number;
  total_topup: number;
  total_fee: number;
  membership: number;
  casual: number;
  total: number;
  titipan: number;
}

export default function TableTopup() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [topup, setTopup] = useState(0);
  const [casual, setCasual] = useState(0);
  const [titipan, setTitipan] = useState(0);
  const [membership, setMembership] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dataHistory, setDataHistory] = useState<TopupResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [listYear, setListYear] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const limitOption = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];

  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1); // bulan 0-11, jadi +1
    const currentYear = String(now.getFullYear());

    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedMonth || !selectedYear) return;
      try {
        setIsLoading(true);
        const response = await axios.get("/api/topup/summary-topup", {
          params: {
            page: currentPage,
            limit: selectedLimit,
            month: selectedMonth,
            year: selectedYear,
          },
        });
        setTopup(response.data.summary.total_topup);
        setCasual(response.data.summary.casual);
        setMembership(response.data.summary.membership);
        setTitipan(response.data.summary.titipan);
        setDataHistory(response.data.data); // ambil array data
        setTotalPages(response.data.totalPage); // ambil total halaman
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedLimit, selectedMonth, selectedYear]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const handleExport = async () => {
    try {
      setIsLoadingExport(true);
      const params = new URLSearchParams({
        startDate,
        endDate,
        type: "TOPUP",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/export-data-transaction?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        },
      );

      if (!response.ok) {
        setIsLoadingExport(false);
        throw new Error("Failed to export file");
      }

      const blob = await response.blob();

      // Buat URL untuk file
      const url = window.URL.createObjectURL(blob);

      // Buat elemen link dan klik otomatis
      const a = document.createElement("a");
      a.href = url;
      a.download = `history-export-${Date.now()}.xlsx`; // nama file
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal mengekspor data. Silakan coba lagi.");
      setIsLoadingExport(false);
    } finally {
      onClose();
      setIsLoadingExport(false);
      setStartDate("");
      setEndDate("");
    }
  };

  if (isLoadingExport) return <Loading />;
  if (!mounted) {
    return null;
  }
  return (
    <>
      <div className="max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between p-3">
          <div className="flex">
            <div className="flex w-full flex-row justify-between space-x-10">
              {/* Month & Year Filter */}
              <div className="flex flex-col items-start justify-start space-y-2">
                <p className="text-xs text-gray-800 dark:text-gray-400">
                  Total Topup
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {Number(topup).toLocaleString("id")}
                </p>
              </div>
              <div className="flex flex-col items-start justify-start space-y-2">
                <p className="text-xs text-gray-800 dark:text-gray-400">
                  Total Membership
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {Number(membership).toLocaleString("id")}
                </p>
              </div>
              <div className="flex flex-col items-start justify-start space-y-2">
                <p className="text-xs text-gray-800 dark:text-gray-400">
                  Total casual
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {Number(casual).toLocaleString("id")}
                </p>
              </div>
              <div className="flex flex-col items-start justify-start space-y-2">
                <p className="text-xs text-gray-800 dark:text-gray-400">
                  Titipan
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  {Number(titipan).toLocaleString("id")}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center space-x-2">
            <div className="flex flex-row items-center gap-2">
              <select
                className="rounded-md border p-2 text-gray-500"
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
                className="rounded-md border p-2 text-gray-500"
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
            <Button
              onClick={handleOpenModal}
              variant="primary"
              className="bg-blue-light-500"
            >
              Export Data
            </Button>
          </div>
        </div>

        <div className="max-w-full border-t-2 border-gray-300">
          <div className="flex max-h-[600px] min-h-[100px] min-w-[1102px] flex-col">
            <div className="flex-1 overflow-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="sticky top-0 z-10 border-b border-gray-300 bg-gray-100 dark:border-white/[1] dark:bg-black">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      #
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Top Up Qty
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Top Up Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Fee
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-sm bg-blue-300 px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-white"
                    >
                      Purchase Membership
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-sm bg-blue-300 px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-white"
                    >
                      Parking Casual
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Titipan
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <td colSpan={11} className="p-5 text-center">
                        Loading...
                      </td>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <td colSpan={11} className="p-5 text-center text-red-500">
                        Failed to load roles.
                      </td>
                    </TableRow>
                  ) : dataHistory.length === 0 ? (
                    <TableRow>
                      <td
                        colSpan={11}
                        className="p-5 text-center text-gray-500"
                      >
                        Data not found.
                      </td>
                    </TableRow>
                  ) : (
                    dataHistory.map((items, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.tanggal
                            ? format(new Date(items.tanggal), "dd MMM yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.total_topup).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.paid).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.total_fee).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm bg-blue-200 px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-white">
                          {Number(items.membership).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm bg-blue-200 px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-white">
                          {Number(items.casual).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.titipan).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <Button
                            onClick={() =>
                              router.push(
                                `/admin/topup/${encodeURIComponent(items.tanggal)}`,
                              )
                            }
                            variant="outline"
                            className="bg-blue-light-500 text-sm"
                          >
                            <FiEye />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="shrink-0 border-t border-slate-300 bg-white dark:bg-black">
              <div className="flex w-full items-center justify-between p-3">
                <div className="flex w-44 items-center space-x-3">
                  <p className="w-1/2 text-right dark:text-white">Per page:</p>
                  <div className="w-20">
                    <Select
                      options={limitOption}
                      onChange={setSelectedLimit}
                      defaultValue={selectedLimit}
                      className="w-20"
                    />
                  </div>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="bg-opacity-50 fixed inset-0 z-999 bg-black/50"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 z-9999 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">
                  <h2 className="text-center text-lg font-semibold">
                    Export Data
                  </h2>

                  {/* Start Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="focus:border-brand-500 focus:ring-brand-200/50 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="focus:border-brand-500 focus:ring-brand-200/50 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {/* Type */}

                  {/* Export Button */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={handleExport}
                      className="bg-brand-500 hover:bg-brand-600 rounded-md px-4 py-3 text-sm font-medium text-white"
                    >
                      Export
                    </button>
                    <button
                      onClick={onClose}
                      className="rounded-md bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
