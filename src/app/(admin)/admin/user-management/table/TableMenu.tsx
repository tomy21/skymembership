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
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import { AnimatePresence, motion } from "framer-motion";

interface MenuData {
  id: 5;
  name: string;
  link: string;
  icon: string;
  position: string;
  slug: string;
  parent_slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  created_by: string;
  modified_by: string;
  subMenus: [
    {
      id: 5;
      name: string;
      link: string;
      icon: string;
      position: string;
      slug: string;
      parent_slug: string;
      created_at: string;
      updated_at: string;
      deleted_at: string;
      created_by: string;
      modified_by: string;
    },
  ];
}

export default function TableMenu() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dataUser, setDataUser] = useState<MenuData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: number]: boolean }>(
    {},
  );

  const limitOption = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const toggleSubmenu = (id: number) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/menu/get-menus", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data.data);
        setDataUser(data.data.menus); // ambil array data
        setTotalPages(data.data.totalPages); // ambil total halaman
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, selectedLimit, search]);

  // const handleOpenModal = () => {
  //   setIsOpen(true);
  // };
  const onClose = () => {
    setIsOpen(false);
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
              // onClick={handleOpenModal}
              variant="primary"
              className="bg-blue-light-500"
            >
              Add Menu
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
                      Link
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Icon
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Position
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400"
                    >
                      Slug
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
                      <React.Fragment key={items.id}>
                        <TableRow>
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {items.created_at
                              ? format(
                                  new Date(items.created_at),
                                  "dd MMM yyyy",
                                )
                              : "-"}
                          </TableCell>
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {items.name}
                          </TableCell>
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {items.link}
                          </TableCell>
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {items.icon}
                          </TableCell>
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {items.position}
                          </TableCell>
                          <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {items.slug}
                          </TableCell>
                          <TableCell className="space-x-2 text-center">
                            <div className="flex items-center justify-center space-x-2 py-1">
                              {!items.link && (
                                <Button
                                  onClick={() => toggleSubmenu(items.id)}
                                  variant="outline"
                                  className="bg-blue-light-500 text-xs"
                                >
                                  {openSubmenus[items.id] ? "Hide" : "Show"}
                                </Button>
                              )}
                              {/* {items.link && (
                                <Button
                                  variant="outline"
                                  className="bg-blue-light-500 text-xs"
                                >
                                  Edit
                                </Button>
                              )} */}
                            </div>
                          </TableCell>
                        </TableRow>

                        {openSubmenus[items.id] &&
                          items.subMenus &&
                          items.subMenus.map((sub, index) => (
                            <TableRow key={index} className="bg-gray-100">
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {index + 1}
                              </TableCell>
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {sub.created_at
                                  ? format(
                                      new Date(sub.created_at),
                                      "dd MMM yyyy",
                                    )
                                  : "-"}
                              </TableCell>
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {sub.name}
                              </TableCell>
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {sub.link}
                              </TableCell>
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {sub.icon}
                              </TableCell>
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {sub.position}
                              </TableCell>
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                                {sub.slug}
                              </TableCell>
                              <TableCell className="text-theme-sm px-5 py-3 text-start font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
                                <Button
                                  variant="outline"
                                  className="bg-blue-light-500 text-xs"
                                >
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
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
    </>
  );
}
