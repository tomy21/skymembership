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
// import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/Loading/Loading";
// import { FiEye } from "react-icons/fi";
import { useParams } from "next/navigation";

interface DetailResponse {
  id: number;
  user_id: number;
  virtual_account: string;
  trxId: string;
  expired_date: string;
  timestamp: string;
  price: string;
  product_name: string;
  periode: string;
  statusPayment: string;
  transactionType: string;
  location_code: string;
  location_name: string;
  invoice_id: string;
  purchase_type: string;
  vehicle_type: string;
  rfid: string;
  createdAt: string;
  updatedAt: string;
  trxHistoryUser: {
    fullname: string;
    email: string;
    points: number;
  };
}

export default function TableTopupDetail() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [dataHistory, setDataHistory] = useState<DetailResponse[]>([]);
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const limitOption = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];

  const params = useParams();
  const dateTrx = params.date;
  // const date = Array.isArray(dateTrx)
  //   ? decodeURIComponent(locationFilterParam[0])
  //   : decodeURIComponent(locationFilterParam || "");

  console.log(dateTrx);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1); // bulan 0-11, jadi +1
    const currentYear = String(now.getFullYear());

    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/topup/detail-topup", {
          params: {
            page: currentPage,
            limit: selectedLimit,
            date: dateTrx,
          },
        });
        setTotalPages(response.data.pagination.totalPages);
        setDataHistory(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, dateTrx, selectedLimit, selectedMonth, selectedYear]);

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
        // type,
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
                      User
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
                      Top Up Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Fee
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <td colSpan={5} className="p-5 text-center">
                        Loading...
                      </td>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <td colSpan={5} className="p-5 text-center text-red-500">
                        Failed to load roles.
                      </td>
                    </TableRow>
                  ) : dataHistory.length === 0 ? (
                    <TableRow>
                      <td colSpan={5} className="p-5 text-center text-gray-500">
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
                          <div className="item-start flex flex-col justify-start">
                            <h1 className="text-semibold text-sm dark:text-gray-50">
                              {items.trxHistoryUser?.fullname}
                            </h1>
                            <h1 className="text-normal text-xs dark:text-gray-50">
                              {items.trxHistoryUser?.email}
                            </h1>
                          </div>
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.virtual_account)}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.price).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {5000}
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
                  <p className="w-1/2 text-right">Per page:</p>
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
