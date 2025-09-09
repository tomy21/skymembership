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
import { useParams } from "next/navigation";
import { format } from "date-fns";
// import { FiEye } from "react-icons/fi";
import Badge from "@/components/ui/badge/Badge";
import { toast } from "sonner";

interface membershipData {
  id: number;
  locationName: string;
  bankName: string;
  transactionNo: string;
  trxDate: string;
  noVirtualAcount: string;
  amount: number;
  typePurchase: string;
  status: string;
  uploadedAt: string;
  uploadedBy: string;
  platNumber: string;
  rfid: string;
  startDate: string;
  endDate: string;
}
type TableReconPerDateProps = {
  date: string;
  bank: string;
  onClose?: () => void;
};

export default function TableReconPerDate({
  date,
  bank,
  onClose,
}: TableReconPerDateProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [membershipTrx, setMembershipTrx] = useState<membershipData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const limitOption = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];
  console.log(date, bank);
  const params = useParams();
  const monthParams = params.month;
  const monthFilter = Array.isArray(monthParams)
    ? decodeURIComponent(monthParams[0])
    : decodeURIComponent(monthParams || "");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // reset ke page 1 setiap kali search berubah
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!monthFilter) {
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/reconsiliasi/bayarind/detail-trx`,
          {
            params: {
              search,
              page: currentPage,
              limit: selectedLimit,
              date: date,
              bank: bank,
            },
          },
        );
        setMembershipTrx(response.data.data); // ambil array data
        setTotalPages(response.data.pagination.totalPages); // ambil total halaman
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, selectedLimit, search, params, monthFilter, date, bank]);

  const handleExportData = async () => {
    try {
      const res = await fetch(
        `/api/export/mutasi?bankName=${bank}&date=${date}`,
      );
      if (!res.ok) throw new Error("Failed to export data");

      const blob = await res.blob();

      // Ambil filename dari header Content-Disposition
      const disposition = res.headers.get("Content-Disposition");
      let filename = "data.xlsx";

      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename; // filename dari API
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Export berhasil! File sedang diunduh...");
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export gagal, coba lagi!");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between p-3">
          <input
            type="text"
            placeholder="Search by no virtual account or transaction no"
            className="w-1/3 rounded-md border p-2 dark:text-white"
            value={search}
            onChange={(e) => handleSearch(e)}
          />
          <div className="flex flex-row items-center justify-center space-x-2">
            <Button
              onClick={handleExportData}
              variant="primary"
              className="bg-blue-light-500"
            >
              Export Data
            </Button>
          </div>
        </div>

        <div className="max-w-full border-t-2 border-gray-300">
          <div className="flex max-h-[600px] min-h-[600px] min-w-[1102px] flex-col">
            <div className="flex-1 overflow-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="sticky top-0 z-10 border-b border-gray-300 bg-gray-100 dark:border-white/[1] dark:bg-black">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      #
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Bank
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Location
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Transaction No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Virtual No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Type Transaction
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      No RFID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Plate Number
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Start Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      End Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                    {/* <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </TableCell> */}
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <td colSpan={13} className="p-5 text-center">
                        Loading...
                      </td>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <td colSpan={13} className="p-5 text-center text-red-500">
                        Failed to load roles.
                      </td>
                    </TableRow>
                  ) : membershipTrx.length === 0 ? (
                    <TableRow>
                      <td
                        colSpan={13}
                        className="p-5 text-center text-gray-500"
                      >
                        Data not found.
                      </td>
                    </TableRow>
                  ) : (
                    membershipTrx.map((items, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>

                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.trxDate
                            ? format(new Date(items.trxDate), "dd MMMM yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.bankName === "BAYARIND_BCA_VIRTUAL_ACCOUNT"
                            ? "Bayarind_BCA"
                            : "NOBU"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.locationName ?? "-"}
                        </TableCell>

                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.transactionNo ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.noVirtualAcount ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.typePurchase ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.rfid ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.platNumber ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.startDate
                            ? format(new Date(items.startDate), "dd MMMM yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.endDate
                            ? format(new Date(items.endDate), "dd MMMM yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.amount).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              items.status === "MATCHED" ? "success" : "warning"
                            }
                          >
                            {items.status === "MATCHED"
                              ? "MATCHED"
                              : "UNMATCHED"}
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
    </>
  );
}
