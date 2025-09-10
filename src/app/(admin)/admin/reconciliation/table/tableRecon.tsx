/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import { format } from "date-fns";
import Badge from "@/components/ui/badge/Badge";
import UploadTxtModal from "@/components/modal/uploadTxt";
import { toast } from "sonner";

interface responseData {
  month: string;
  totalTransaction: number;
  totalAmount: string;
  matchedCount: string;
  unmatchedCount: string;
  topupCount: string;
  nonTopupCount: string;
}

interface propsBank {
  bankName: string;
}

export default function TableRecon({ bankName }: propsBank) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [dataHistory, setDataHistory] = useState<responseData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/reconsiliasi/bayarind", {
          params: {
            page: currentPage,
            limit: selectedLimit,
            year: "2025",
            bank: bankName,
          },
        });
        setDataHistory(response.data.data); // ambil array data
        setTotalPages(response.data.pagination.totalPages); // ambil total halaman
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
    fetchDataYear();
    fetchData();
    const now = new Date();
    const currentYear = String(now.getFullYear());
    setSelectedYear(currentYear);
  }, [bankName, currentPage, selectedLimit, selectedYear]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/reconsiliasi/bayarind", {
        params: {
          page: currentPage,
          limit: selectedLimit,
          year: "2025",
          bank: bankName,
        },
      });
      setDataHistory(response.data.data); // ambil array data
      setTotalPages(response.data.pagination.totalPages); // ambil total halaman
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsLoadingExport(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadBayarind = "/api/reconsiliasi/uploadMutasi";
      const uploadNobu = "/api/reconsiliasi/uploadMutasiNobu";

      const res = await fetch(
        `${bankName === "BANK_NATIONAL_NOBU_VIRTUAL_ACCOUNT" ? uploadNobu : uploadBayarind}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Upload gagal");
      const data = await res.json();

      toast.success(
        `Upload selesai ✅\nTotal: ${data.data.data.total}\nBerhasil: ${data.data.data.inserted}\nGagal (duplikat): ${data.data.data.skipped}`,
      );
      fetchData();
    } catch (err: any) {
      toast.error("Upload gagal ❌: " + err.message);
    } finally {
      setIsLoadingExport(false);
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
          <div className="flex flex-row items-center justify-center space-x-2">
            <Button
              onClick={handleOpenModal}
              variant="primary"
              className="bg-blue-light-500"
            >
              {bankName === "BAYARIND_BCA_VIRTUAL_ACCOUNT"
                ? "Upload File Mutation BCA"
                : "Upload File Mutation NOBU"}
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
                      Total Transaction
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Total Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Match
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Unmatch
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Top Up
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Purchase
                    </TableCell>

                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </TableCell>

                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Action
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
                        className="p-5 text-center text-gray-500 dark:text-white"
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
                          {items.month
                            ? format(new Date(items.month), "MMMM yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.totalTransaction).toLocaleString(
                            "id-ID",
                          )}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.totalAmount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.matchedCount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.unmatchedCount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.topupCount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.nonTopupCount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              items.unmatchedCount === "0"
                                ? "success"
                                : "warning"
                            }
                          >
                            {items.unmatchedCount === "0"
                              ? "Completed"
                              : "Incompleted"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-theme-xs px-5 py-3 text-center font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <Button
                            onClick={() =>
                              router.push(
                                `/admin/reconciliation/${bankName === "BAYARIND_BCA_VIRTUAL_ACCOUNT" ? "bayarind" : "nobu"}/${encodeURIComponent(items.month)}`,
                              )
                            }
                            variant="outline"
                            className="bg-blue-light-500 -p-2 text-sm"
                          >
                            Detail
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

      {isOpen && (
        <UploadTxtModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onUpload={handleUpload}
          bankName={bankName}
        />
      )}
    </>
  );
}
