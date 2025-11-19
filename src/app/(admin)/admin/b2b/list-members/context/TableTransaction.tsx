"use client";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
// import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import Badge from "@/components/ui/badge/Badge";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/Loading/Loading";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";

interface responseData {
  additonal_fee: number;
  admin_fee: string;
  amount: number;
  created_at: string;
  expired_date: string;
  id: string;
  invoice_id: string;
  periode: string;
  price: string;
  product_name: string;
  purchase_type: string;
  status_payment: string;
  status_progress: string;
  timestamp: string;
  total_admin_fee: string;
  total_price: string;
  trx_id: string;
  type_payment: string;
  updated_at: string;
  user_id: string;
  virtual_account_name: string;
  virtual_account_number: string;
}

export default function TableTransaction() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [dataHistory, setDataHistory] = useState<responseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [listYear, setListYear] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const limitOption = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1); // bulan 0-11, jadi +1
    const currentYear = String(now.getFullYear());

    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedMonth || !selectedYear) return;
      try {
        setIsLoading(true);
        const response = await axios.get("/api/tenant/transaction/get-all", {
          params: {
            page: currentPage,
            limit: selectedLimit,
            search,
            month: selectedMonth,
            year: selectedYear,
          },
        });
        console.log(response.data);
        setDataHistory(response.data.data); // ambil array data
        setTotalPages(response.data.totalPages); // ambil total halaman
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDataYear = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/year-transaction", {
          params: {
            page: currentPage,
            limit: selectedLimit,
            search,
          },
        });
        setListYear(response.data.data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    fetchDataYear();
  }, [currentPage, selectedLimit, search, selectedMonth, selectedYear]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const handleExport = async () => {
    try {
      setIsLoadingExport(true);
      const start = startDate ? format(startDate, "yyyy-MM-dd") : "";
      const end = endDate ? format(endDate, "yyyy-MM-dd") : "";

      const params = new URLSearchParams({
        startDate: start,
        endDate: end,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/export-data-payment?${params.toString()}`,
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

      setIsLoadingExport(false);
    } catch (error) {
      console.error("Export error:", error);
      alert("Gagal mengekspor data. Silakan coba lagi.");
      setIsLoadingExport(false);
    } finally {
      onClose();
      setIsLoadingExport(false);
      setStartDate(null);
      setEndDate(null);
    }
  };

  if (!mounted) {
    return null;
  }
  return (
    <>
      {isLoadingExport && <Loading />}
      <div className="max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between p-3">
          {/* <input
            type="text"
            placeholder="Search by name..."
            className="w-1/3 rounded-md border p-2 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
          <div className="flex w-1/2 flex-row space-x-2">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full rounded-md border p-2 sm:w-1/3 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Month & Year Filter */}
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
          </div>
          <div className="flex flex-row items-center justify-center space-x-2">
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
                      Virtual Account
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Periode
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Price
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Admin Fee
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Total Fee
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Total Price
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>
                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <td
                        colSpan={11}
                        className="p-5 text-center dark:text-white"
                      >
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
                          {format(new Date(items.updated_at), "dd-MMM-yyyy")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-start justify-start">
                            <h1 className="font-semibold whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {items.virtual_account_name}
                            </h1>
                            <h1 className="font-medium text-gray-300 dark:text-gray-200">
                              {items.virtual_account_number}
                            </h1>
                          </div>
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.product_name}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-wrap text-gray-500 dark:text-gray-400">
                          {Number(items.amount) ?? "0"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-wrap text-gray-500 dark:text-gray-400">
                          {Number(items.price).toLocaleString("id") ?? 0}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-wrap text-gray-500 dark:text-gray-400">
                          {Number(items.admin_fee).toLocaleString("id") ?? 0}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-wrap text-gray-500 dark:text-gray-400">
                          {Number(items.total_admin_fee).toLocaleString("id") ??
                            0}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-wrap text-gray-500 dark:text-gray-400">
                          {Number(items.total_price).toLocaleString("id") ?? 0}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              items.status_payment === "COMPLETED"
                                ? "success"
                                : items.status_payment === "FAILED"
                                  ? "error"
                                  : "warning"
                            }
                          >
                            {items.status_payment === "COMPLETED"
                              ? "PAID"
                              : items.status_payment === "FAILED"
                                ? "FAILED"
                                : "Pending"}
                          </Badge>
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
                  <div className="flex items-center justify-start space-x-10">
                    <label className="text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="yyyy-MM-dd"
                      className="focus:border-brand-500 focus:ring-brand-200/50 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring"
                      placeholderText="Select start date"
                    />
                  </div>

                  {/* End Date */}
                  <div className="flex items-center justify-start space-x-12">
                    <label className="text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      minDate={startDate ?? undefined} // biar endDate tidak bisa sebelum startDate
                      dateFormat="yyyy-MM-dd"
                      className="focus:border-brand-500 focus:ring-brand-200/50 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring"
                      placeholderText="Select end date"
                    />
                  </div>

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
