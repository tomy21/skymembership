"use client";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
// import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Badge from "@/components/ui/badge/Badge";
import Loading from "@/components/Loading/Loading";
import { toast } from "sonner";

interface CardResponse {
  id: string;
  no_card: string;
  is_used: boolean;
  tennant_code?: string;
  tennant_name?: string;
  card_type: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  location_code: string;
  location_name: string;
  created_at: string;
}

export default function TableMasterCard() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [masterCard, setMasterCard] = useState<CardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const limitOption = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/master-card", {
          params: {
            page: currentPage,
            limit: selectedLimit,
            search,
          },
        });

        setMasterCard(response.data.data); // ambil array data
        setTotalPages(response.data.page.totalPages); // ambil total halaman
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, selectedLimit, search]);

  const openModalUpload = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoadingUpload(true);
      if (!selectedFile) {
        toast.error("Pilih file terlebih dahulu!");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post("/api/upload-datamember", formData);

      if (response.data.success === true) {
        setIsLoadingUpload(false);
        toast.success("Data berhasil diupload");
      }

      onClose();
    } catch (error) {
      console.error("Gagal upload:", error);
      toast.error("Gagal upload");
      setIsLoadingUpload(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (isLoadingUpload) {
    return <Loading />;
  }

  return (
    <>
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between p-3">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-1/3 rounded-md border p-2 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-row items-center justify-center space-x-2">
            {/* <Button
              //   onClick={handleModalAdd}
              variant="primary"
              className="bg-blue-light-500"
            >
              Add Card
            </Button> */}
            <Button
              onClick={openModalUpload}
              variant="primary"
              className="bg-green-500 hover:bg-green-600"
            >
              Upload Card
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
                      Created Date
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
                      Location
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Type Card
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Used
                    </TableCell>

                    {/* <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                    >
                      Action
                    </TableCell> */}
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <td
                        colSpan={7}
                        className="p-5 text-center dark:text-white"
                      >
                        Loading...
                      </td>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <td colSpan={7} className="p-5 text-center text-red-500">
                        Failed to load roles.
                      </td>
                    </TableRow>
                  ) : masterCard.length === 0 ? (
                    <TableRow>
                      <td colSpan={7} className="p-5 text-center text-gray-500">
                        Data not found.
                      </td>
                    </TableRow>
                  ) : (
                    masterCard.map((items, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.created_at
                            ? format(new Date(items.created_at), "dd MMM yyyy")
                            : "-"}
                        </TableCell>

                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.no_card ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.location_code ?? "-"} - {items.location_name}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.card_type ?? "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            size="sm"
                            color={items.is_used === true ? "success" : "error"}
                          >
                            {items.is_used === true ? "Used" : "Not Used"}
                          </Badge>
                        </TableCell>
                        {/* <TableCell className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          <Button
                            onClick={() =>
                              router.push(
                                `/admin/list-membership/${encodeURIComponent(items.location_name)}`,
                              )
                            }
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
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={onClose}
                >
                  X
                </button>

                <div className="space-y-4">
                  <h2 className="text-center text-lg font-semibold">
                    Upload Excel File
                  </h2>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && file.name.match(/\.(xlsx|xls)$/)) {
                          setSelectedFile(file);
                        } else {
                          alert("File harus Excel (.xlsx / .xls)");
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-blue-400"
                    >
                      <p className="text-gray-500">
                        Drag & Drop Excel file here
                      </p>
                      <p className="text-sm text-gray-400">
                        or click below to browse
                      </p>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        name="excelFile"
                        className="hidden"
                        id="fileUpload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.name.match(/\.(xlsx|xls)$/)) {
                            setSelectedFile(file);
                          } else {
                            alert("File harus Excel (.xlsx / .xls)");
                          }
                        }}
                      />
                      <label
                        htmlFor="fileUpload"
                        className="mt-2 inline-block cursor-pointer text-blue-600 hover:underline"
                      >
                        Browse File
                      </label>
                    </div>

                    {selectedFile && (
                      <div className="text-center text-sm text-green-600">
                        File terpilih: <strong>{selectedFile.name}</strong>
                      </div>
                    )}

                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        Upload
                      </button>
                      <button
                        onClick={onClose}
                        type="button"
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
