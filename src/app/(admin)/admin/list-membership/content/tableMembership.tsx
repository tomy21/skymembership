"use client";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
// import { format, set } from 'date-fns';
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

interface locatioMembership {
  location_code: string;
  location_name: string;
  totalMobil: number;
  totalMotor: number;
  totalAmountMobil: number;
  totalAmountMotor: number;
  totalAmount: number;
}

export default function TableMembership() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [membershipTrx, setMembershipTrx] = useState<locatioMembership[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
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

  const router = useRouter();

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
    const fetchData = async () => {
      if (!selectedMonth || !selectedYear) return;
      try {
        setIsLoading(true);
        const response = await axios.get("/api/location-member", {
          params: {
            page: currentPage,
            limit: selectedLimit,
            search,
            month: selectedMonth,
            year: selectedYear,
          },
        });
        setMembershipTrx(response.data.data); // ambil array data
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
    fetchDataYear();
    fetchData();
  }, [currentPage, selectedLimit, search, selectedMonth, selectedYear]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3">
          {/* Input Search */}
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
        </div>

        <div className="max-w-full border-t-2 border-gray-300">
          <div className="flex max-h-[600px] min-h-[100px] min-w-[1102px] flex-col">
            <div className="flex-1 overflow-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="sticky top-0 z-10 border-b border-gray-300 bg-gray-100 dark:border-white/[1] dark:bg-black">
                  {/* Row 1 */}
                  <TableRow>
                    <TableCell
                      isHeader
                      rowSpan={2}
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      #
                    </TableCell>
                    <TableCell
                      isHeader
                      rowSpan={2}
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Location
                    </TableCell>
                    <TableCell
                      isHeader
                      colSpan={2}
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Mobil
                    </TableCell>
                    <TableCell
                      isHeader
                      colSpan={2}
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Motor
                    </TableCell>
                    <TableCell
                      isHeader
                      rowSpan={2}
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Total
                    </TableCell>
                    <TableCell
                      isHeader
                      rowSpan={2}
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </TableCell>
                  </TableRow>

                  {/* Row 2 */}
                  <TableRow>
                    <TableCell
                      isHeader
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Quantity
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs border border-gray-400 px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <td
                        colSpan={8}
                        className="p-5 text-center dark:text-white"
                      >
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
                          {items.location_name ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          {items.totalMobil ?? "0"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          {new Intl.NumberFormat("id-ID").format(
                            items.totalAmountMobil ?? 0,
                          )}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          {items.totalMotor ?? "0"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          {new Intl.NumberFormat("id-ID").format(
                            items.totalAmountMotor ?? 0,
                          )}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          {new Intl.NumberFormat("id-ID").format(
                            items.totalAmount ?? 0,
                          )}
                        </TableCell>

                        <TableCell className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          <Button
                            onClick={() =>
                              router.push(
                                `/admin/list-membership/${encodeURIComponent(items.location_code)}?month=${selectedMonth}&year=${selectedYear}`,
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
    </>
  );
}
