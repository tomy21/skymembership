"use client";
import Select from "@/components/form/Select";
import Loading from "@/components/Loading/Loading";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface PurchaseResponse {
  id: string;
  user_id: string;
  invoice_id: string;
  virtual_account_number: string;
  virtual_account_name: string;
  trx_id: string;
  expired_date: string;
  timestamp: string;
  amount: number;
  price: string;
  admin_fee: string;
  total_admin_fee: string;
  total_price: string;
  additonal_fee: null;
  product_name: string;
  periode: string;
  status_payment: string;
  status_progress: string;
  type_payment: string;
  purchase_type: string;
  created_at: string;
  updated_at: string;
}

export default function TableBillingPayment() {
  const [mounted, setMounted] = useState(false);
  const [dataHistory, setDataHistory] = useState<PurchaseResponse[]>([]);
  const [isLoading] = useState(false);
  const [isLoadingExport] = useState(false);
  const [isError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const limitOption = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `/api/tenant/purchase-history?page=${currentPage}&limit=${selectedLimit}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();

        if (response.ok) {
          // const data = await response.json();
          setTotalPages(data.pagination.totalPages);
          setDataHistory(data.data);
        } else {
          console.error("Error fetching history:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, [currentPage, selectedLimit]);

  if (isLoadingExport) return <Loading />;
  if (!mounted) {
    return null;
  }
  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-3 flex items-center justify-between p-3">
          <p className="text-sm font-semibold">Bill and Payment History</p>
          <div className="flex flex-row items-center justify-center space-x-2">
            <p className="cursor-pointer text-sm text-blue-400">View All</p>
          </div>
        </div>

        <div className="w-full border-t-2 border-gray-300">
          <div className="flex max-h-[600px] min-h-[400px] flex-col">
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
                      Transaction Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Invoice No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Product
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
                      Total Price
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Invoice
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
                          {items.created_at
                            ? format(
                                new Date(items.created_at),
                                "dd MMM yyyy HH:mm:ss",
                              )
                            : "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.invoice_id}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.product_name}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.amount}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {Number(items.total_price).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell
                          className={`text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap ${items.status_payment === "PAID" ? "text-gray-500 dark:text-gray-400" : items.status_payment === "PENDING" ? "text-yellow-500" : "text-red-500"} `}
                        >
                          {items.status_payment}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <Button
                            variant="primary"
                            size="sm"
                            // onClick={() => handleDownloadInvoice(items.invoice_id)}
                          >
                            View
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
    </>
  );
}
