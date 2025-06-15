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
import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import Badge from "@/components/ui/badge/Badge";

interface membershipData {
  id: number;
  location_code: string;
  location_name: string;
  vehicle_type: string;
  rfid: string;
  timestamp: string;
  price: number;
  periode: string;
  statusPayment: string;
  trxHistoryUser: {
    id: number;
    fullname: string;
    email: string;
    points: number;
  };
}

export default function TableDetailMembers() {
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

  const params = useParams();
  const locationFilterParam = params.locationFilter;
  const locationFilter = Array.isArray(locationFilterParam)
    ? decodeURIComponent(locationFilterParam[0])
    : decodeURIComponent(locationFilterParam || "");

  const searchParams = useSearchParams();
  const month = searchParams.get("month") || "1";
  const year = searchParams.get("year") || "2024";

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/location-member/${locationFilter}`,
          {
            params: {
              page: currentPage,
              limit: selectedLimit,
              month,
              year,
              search,
            },
          },
        );
        setMembershipTrx(response.data.data); // ambil array data
        setTotalPages(response.data.totalPages); // ambil total halaman
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, selectedLimit, search, params, locationFilter, month, year]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between p-3">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-1/3 rounded-md border p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-row items-center justify-center space-x-2">
            <Button
              //   onClick={handleModalAdd}
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
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      #
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Membership
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Point
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      RFID No
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Vehicle Type
                    </TableCell>

                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Transfer Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Price
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Periode
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <td colSpan={8} className="p-5 text-center">
                        Loading...
                      </td>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <td colSpan={8} className="p-5 text-center text-red-500">
                        Failed to load roles.
                      </td>
                    </TableRow>
                  ) : membershipTrx.length === 0 ? (
                    <TableRow>
                      <td colSpan={8} className="p-5 text-center text-gray-500">
                        Data not found.
                      </td>
                    </TableRow>
                  ) : (
                    membershipTrx.map((items, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>

                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-start justify-start">
                            <h1 className="font-semibold text-gray-500 dark:text-gray-400">
                              {items.trxHistoryUser?.fullname ?? "-"}
                            </h1>
                            <h1 className="font-medium text-gray-300 dark:text-gray-200">
                              {items.trxHistoryUser?.email}
                            </h1>
                          </div>
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {Number(items.trxHistoryUser?.points).toLocaleString(
                            "id-ID",
                          )}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.rfid === "" ? "-" : items.rfid}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.vehicle_type === "" ? "-" : items.vehicle_type}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.timestamp
                            ? format(new Date(items.timestamp), "dd MMM yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {Number(items.price).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.periode === "" ? "-" : items.periode}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              items.statusPayment === "PAID"
                                ? "success"
                                : "error"
                            }
                          >
                            {items.statusPayment === "PAID" ? "PAID" : "UNPAID"}
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
