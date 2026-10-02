"use client";

import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";
import Badge from "@/components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@headlessui/react";
import axios from "axios";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ModalDetailPoint from "../components/ModalDetailPoint";

interface MembershipDetail {
  id: number;
  location_id: string;
  location_name: string;
  start_date: string;
  end_date: string;
  is_active: number;
  isActive: boolean;
}

interface MemberCustomer {
  id: number;
  fullname: string;
  email: string;
  phone_number: string;
  points: number;
  username: string;
  created_at: string;
}

interface UserData {
  id: number;
  cust_id: number;
  member_customer_no: string;
  rfid: string;
  vehicle_type: string;
  plate_number: string;
  Member_Customer?: MemberCustomer;
  membershipDetail?: MembershipDetail;
}

interface HistoryUserData {
  fullname: string;
  email: string;
  phone_number: string;
}

interface LocationOption {
  value: string;
  label: string;
}

interface LocationResponse {
  id: number;
  location_code: string;
  location_name: string;
  KID: string;
  address: string;
}

interface ApiResponse {
  total: number;
  totalPages: number;
  currentPage: number;
  data: UserData[];
}

export default function TableCustomer() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState("10");
  const [totalPages, setTotalPages] = useState(1);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [dataUser, setDataUser] = useState<UserData[]>([]);

  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [exportStatus, setExportStatus] = useState("");
  const [exportLocation, setExportLocation] = useState("");

  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([
    {
      value: "",
      label: "All Location",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [historyData, setHistoryData] = useState([]);
  const [userData, setUserData] = useState<HistoryUserData | null>(null);
  const [loading, setLoading] = useState(false);

  const limitOption = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];

  const statusOptions = [
    {
      value: "",
      label: "All Status",
    },
    {
      value: "active",
      label: "Active",
    },
    {
      value: "inactive",
      label: "Inactive",
    },
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Fetch location
   */
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/api/location", {
          params: {
            page: 1,
            limit: 1000,
            search: "",
          },
        });

        const locations: LocationResponse[] = response.data?.data || [];

        const options: LocationOption[] = [
          {
            value: "",
            label: "All Location",
          },
          ...locations.map((item) => ({
            value: item.location_code,
            label: item.location_name,
          })),
        ];

        console.log("[LOCATION OPTIONS]", options);

        setLocationOptions(options);
      } catch (error) {
        console.error("[LOCATION ERROR]", error);

        setLocationOptions([
          {
            value: "",
            label: "All Location",
          },
        ]);
      }
    };

    fetchLocations();
  }, []);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      console.log("[EXPORT PARAMS]", {
        search: search.trim(),
        status: exportStatus,
        location: exportLocation,
      });

      const response = await axios.get("/api/user-management/customer/export", {
        params: {
          search: search.trim(),
          status: exportStatus,
          location: exportLocation,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `membership-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Export membership failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Fetch membership data
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const params = {
          page: currentPage,
          limit: selectedLimit,
          search: search.trim(),
          status,
          location,
        };

        console.log("[FILTER PARAMS]", params);

        const response = await axios.get("/api/user-management/customer", {
          params,
        });

        console.log("[FILTER RESPONSE]", response.data);

        setDataUser(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("[FILTER ERROR]", error);

        setIsError(true);
        setDataUser([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedLimit, search, status, location]);

  /**
   * Fetch point history
   */
  const fetchDataHistory = async (idUser: number) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/riwayat-point-byuser?userId=${idUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.status}`);
      }

      const data = await response.json();

      setHistoryData(data.data || []);
      setUserData(data.userData || null);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch point history:", error);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  /**
   * Reset all filters
   */
  const handleResetFilter = () => {
    setSearch("");
    setStatus("");
    setLocation("");
    setCurrentPage(1);
  };

  /**
   * Change limit
   */
  const handleLimitChange = (value: string) => {
    setSelectedLimit(value);
    setCurrentPage(1);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Filter */}
        <div className="flex flex-wrap items-center gap-3 p-3">
          {/* Search */}
          <div className="min-w-[250px] flex-1">
            <input
              type="text"
              placeholder="Search name, email, plate, RFID..."
              className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm transition outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Status */}
          <div className="w-40">
            <Select
              options={statusOptions}
              onChange={(value) => {
                setStatus(value);
                setCurrentPage(1);
              }}
              defaultValue={status}
              placeholder="Status"
            />
          </div>

          {/* Location */}
          <div className="w-52">
            <Select
              options={locationOptions}
              onChange={(value) => {
                setLocation(value);
                setCurrentPage(1);
              }}
              defaultValue={location}
              placeholder="Location"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setExportStatus(status);
              setExportLocation(location);
              setIsExportModalOpen(true);
            }}
            className="rounded-lg border border-green-500 bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-600"
          >
            Export Excel
          </button>

          {/* Reset */}
          {(search || status || location) && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          )}
        </div>

        {/* Table */}
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

                    {/* <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Points
                    </TableCell> */}

                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Customer No
                    </TableCell>

                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Name
                    </TableCell>

                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Contact
                    </TableCell>

                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Vehicle Detail
                    </TableCell>

                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Member Detail
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
                      Action
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <td colSpan={9} className="p-5 text-center">
                        Loading...
                      </td>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <td colSpan={9} className="p-5 text-center text-red-500">
                        Failed to load membership data.
                      </td>
                    </TableRow>
                  ) : dataUser.length === 0 ? (
                    <TableRow>
                      <td colSpan={9} className="p-5 text-center text-gray-500">
                        Data not found.
                      </td>
                    </TableRow>
                  ) : (
                    dataUser.map((items, index) => {
                      const member = items.Member_Customer;
                      const membership = items.membershipDetail;

                      const rowNumber =
                        (currentPage - 1) * Number(selectedLimit) + index + 1;

                      const isActive = membership?.isActive === true;

                      return (
                        <TableRow key={items.id}>
                          {/* Number */}
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {rowNumber}
                          </TableCell>

                          {/* Points */}
                          {/* <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {member?.points ?? 0}
                          </TableCell> */}

                          {/* Customer No */}
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {items.member_customer_no || "-"}
                          </TableCell>

                          {/* Name */}
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-start justify-center">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {member?.fullname || "-"}
                              </p>

                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {member?.username || "-"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Contact */}
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-start justify-center">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {member?.email || "-"}
                              </p>

                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {member?.phone_number || "-"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Vehicle */}
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-start justify-center">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {items.vehicle_type || "-"}
                              </p>

                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {items.plate_number || "-"} -{" "}
                                {items.rfid || "-"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Membership */}
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-start justify-center">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {membership?.location_name || "-"}
                              </p>

                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="pr-1 text-black dark:text-white">
                                  End Date:
                                </span>

                                {membership?.end_date
                                  ? format(
                                      new Date(membership.end_date),
                                      "dd MMM yyyy",
                                    )
                                  : "-"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <Badge
                              size="sm"
                              color={isActive ? "success" : "error"}
                            >
                              {isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>

                          {/* Action */}
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            <Button
                              className="rounded-lg border p-2"
                              onClick={() => fetchDataHistory(items.cust_id)}
                            >
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="shrink-0 border-t border-slate-300 bg-white dark:bg-black">
              <div className="flex w-full items-center justify-between p-3">
                <div className="flex w-44 items-center space-x-3">
                  <p className="w-1/2 text-right">Per page:</p>

                  <div className="w-20">
                    <Select
                      options={limitOption}
                      onChange={handleLimitChange}
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

      {/* Existing modal */}
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
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <div
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-4">edd</div>

                <button
                  onClick={onClose}
                  className="rounded-md bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ModalDetailPoint
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        userData={{
          fullname: userData?.fullname || "",
          email: userData?.email || "",
          phone_number: userData?.phone_number || "",
        }}
        data={historyData || []}
      />

      {isExportModalOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4"
          onClick={() => !isExporting && setIsExportModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Export Membership
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Pilih filter data yang ingin diexport.
                </p>
              </div>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => setIsExportModalOpen(false)}
                className="text-xl text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 px-6 py-5">
              {/* Search */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Search
                </label>

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {search.trim() || "All data"}
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  Export akan mengikuti search yang sedang digunakan.
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Status
                </label>

                <Select
                  options={statusOptions}
                  onChange={(value) => {
                    setExportStatus(value);
                  }}
                  defaultValue={exportStatus}
                  placeholder="Pilih Status"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Location
                </label>

                <Select
                  options={locationOptions}
                  onChange={(value) => {
                    setExportLocation(value);
                  }}
                  defaultValue={exportLocation}
                  placeholder="Pilih Location"
                />
              </div>

              {/* Preview */}
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="mb-2 text-sm font-medium text-blue-800">
                  Export Filter
                </p>

                <div className="space-y-1 text-sm text-blue-700">
                  <div className="flex justify-between gap-4">
                    <span>Status</span>

                    <span className="font-medium">
                      {exportStatus
                        ? exportStatus === "active"
                          ? "Active"
                          : "Inactive"
                        : "All Status"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Location</span>

                    <span className="max-w-[220px] truncate font-medium">
                      {exportLocation
                        ? locationOptions.find(
                            (item) => item.value === exportLocation,
                          )?.label || exportLocation
                        : "All Location"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                Export akan mengambil seluruh data sesuai filter, bukan hanya
                data pada halaman yang sedang dibuka.
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setIsExportModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={handleExport}
                className="rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isExporting ? "Exporting..." : "Export Excel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
