"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

type ParkingTableProps = {
  title: string;
  columns: string[];
  data: Record<string, string | number>[];
};

export default function ParkingTable({
  title,
  columns,
  data,
}: ParkingTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  const locations = Array.from(
    new Set(data.map((d) => d.Location ?? "")),
  ).filter(Boolean);

  const filteredData = data.filter((row) => {
    const matchesSearch = Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || row.Location === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="text-lg font-semibold text-gray-800">{title}</div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            className="rounded border px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filter */}
          <select
            className="rounded border px-2 py-1 text-sm text-gray-700 focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Locations</option>
            {locations.map((loc, i) => (
              <option key={i} value={loc as string}>
                {loc}
              </option>
            ))}
          </select>

          {/* New Order */}
          <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
            <FaPlus className="text-xs" />
            New Order
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full text-sm">
        {/* <thead className="bg-gray-100 text-gray-600">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-2 text-left whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead> */}
        <div className="flex-1 overflow-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="sticky top-0 z-10 border-b border-gray-300 bg-gray-100 dark:border-white/[1] dark:bg-black">
              <TableRow>
                {columns.map((col, i) => (
                  <>
                    <TableCell
                      key={i}
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      {col}
                    </TableCell>
                  </>
                ))}
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
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <td colSpan={11} className="p-5 text-center text-gray-500">
                    Data not found.
                  </td>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <>
                    <TableRow key={index}>
                      {Object.values(row).map((val, i) => (
                        <TableCell
                          key={i}
                          className="text-theme-xs px-5 py-3 text-center font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                        >
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  </>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </table>
    </div>
  );
}
