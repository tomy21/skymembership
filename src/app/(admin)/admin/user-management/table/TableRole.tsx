"use client";
import Pagination from "@/components/tables/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Select from "@/components/form/Select";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

interface RoleData {
  id: number;
  name: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  modified_by: null;
}

export default function TableCustomer() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dataUser, setDataUser] = useState<RoleData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedLimit, search]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/user-management/role", {
        params: {
          page: currentPage,
          limit: selectedLimit,
          search,
        },
      });
      console.log(response.data.data);
      setDataUser(response.data.data); // ambil array data
      setTotalPages(response.data.totalPages); // ambil total halaman
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return alert("Role name is required");

    try {
      setIsSubmitting(true);
      if (!roleName.trim()) {
        alert("Role name is required");
        return;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/create-role`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name: roleName }),
        },
      );

      console.log(response.status);
      if (response.status !== 200) return toast.error("Failed to create role");

      toast.success("Role created successfully!");
      // Refresh data
      setCurrentPage(1); // optionally reset page
      setSearch(""); // optionally reset search
      setIsOpen(false); // close modal
      setRoleName(""); // reset form
      fetchData();
    } catch (error) {
      console.error("Failed to create role:", error);
      toast.error("Failed to create role");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
              onClick={handleOpenModal}
              variant="primary"
              className="bg-blue-light-500"
            >
              Add Role
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
                      Create Date
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
                      Created By
                    </TableCell>

                    {/* <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </TableCell> */}
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
                  ) : dataUser.length === 0 ? (
                    <TableRow>
                      <td
                        colSpan={11}
                        className="p-5 text-center text-gray-500"
                      >
                        Data not found.
                      </td>
                    </TableRow>
                  ) : (
                    dataUser.map((items, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.created_at
                            ? format(new Date(items.created_at), "dd MMM yyyy")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.name}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {items.created_by}
                        </TableCell>
                        {/* <TableCell className="text-theme-xs px-5 py-3 text-center font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <Button
                            // onClick={() =>
                            //   router.push(
                            //     `/admin/list-membership/${encodeURIComponent(items.location_name)}`,
                            //   )
                            // }
                            variant="outline"
                            className="bg-blue-light-500 -p-2 text-sm"
                          >
                            Edit
                          </Button>
                        </TableCell> */}
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
                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                  Add New Role
                </h2>

                {/* Role Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role Name
                    </label>
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="Enter role name"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                        isSubmitting
                          ? "bg-blue-300"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isSubmitting ? "Saving..." : "Save Role"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
