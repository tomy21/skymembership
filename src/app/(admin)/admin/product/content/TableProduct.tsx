"use client";
import Pagination from "@/components/tables/Pagination";
// import Button from "@/components/ui/button/Button";
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
// import Button from "@/components/ui/button/Button";
import { AnimatePresence, motion } from "framer-motion";
import { addMonths, endOfMonth, startOfMonth } from "date-fns";

interface dataProduct {
  id: number;
  product_code: string;
  product_name: string;
  vehicle_type: string;
  location_code: string;
  price: number;
  card_activation_fee: number;
  periode: string;
  start_date: string;
  end_date: string;
  Fee: number;
  location_area: {
    location_code: string;
    location_name: string;
  };
}

type FormFields = {
  location_code: string;
  vehicle_type: string;
  periode: string;
  price: number;
  card_activation_fee: number;
  fee: number;
  kid: string;
  create_by: string;
  update_by: string;
};

export default function TableProduct() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLimit, setSelectedLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<dataProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormFields>({
    location_code: "",
    vehicle_type: "MOBIL",
    periode: "4 Bulan",
    price: 0,
    card_activation_fee: 0,
    fee: 0,
    kid: "",
    create_by: "",
    update_by: "",
  });

  const [loading, setLoading] = useState(false);

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
        const response = await axios.get("/api/product", {
          params: {
            page: currentPage,
            limit: selectedLimit,
            search,
          },
        });

        setProduct(response.data.data); // ambil array data
        setTotalPages(response.data.totalPages); // ambil total halaman
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, selectedLimit, search]);

  // const openModalAdd = () => {
  //   setIsOpen(true);
  // };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const months = parseInt(form.periode);
    const now = new Date();
    const startDate = startOfMonth(now);
    const endDate = endOfMonth(addMonths(startDate, months - 1));

    const product_code = `${form.location_code}_${form.vehicle_type}`;
    const product_name = `${product_code} ${form.periode}`;

    const payload = {
      product_code,
      product_name,
      periode: form.periode,
      vehicle_type: form.vehicle_type,
      location_code: form.location_code,
      KID: form.kid,
      price: Number(form.price),
      card_activation_fee: Number(form.card_activation_fee),
      Fee: Number(form.fee),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      Create_by: form.create_by,
      Update_by: form.update_by,
    };

    try {
      await axios.post("/api/products", payload);
      alert("Produk berhasil ditambahkan");
      onClose();
    } catch (error) {
      alert("Gagal menambahkan produk");
      console.error(error);
    } finally {
      setLoading(false);
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
            placeholder="Search by name..."
            className="w-1/3 rounded-md border p-2 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <div className="flex flex-row items-center justify-center space-x-2">
            <Button
              onClick={openModalAdd}
              variant="primary"
              className="bg-blue-light-500"
            >
              Add Product
            </Button>
          </div> */}
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
                      Name
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
                      Vehicle
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Periode
                    </TableCell>
                    <TableCell
                      isHeader
                      className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                    >
                      Price
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
                        colSpan={5}
                        className="p-5 text-center dark:text-white"
                      >
                        Loading...
                      </td>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <td colSpan={5} className="p-5 text-center text-red-500">
                        Failed to load roles.
                      </td>
                    </TableRow>
                  ) : product.length === 0 ? (
                    <TableRow>
                      <td colSpan={5} className="p-5 text-center text-gray-500">
                        Data not found.
                      </td>
                    </TableRow>
                  ) : (
                    product.map((items, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.product_code} - {items.product_name}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.location_area?.location_code} -{" "}
                          {items.location_area?.location_name}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.vehicle_type ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {items.periode ?? "-"}
                        </TableCell>
                        <TableCell className="text-theme-sm px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          {Number(items.price).toLocaleString("id-ID")}
                        </TableCell>

                        {/* <TableCell className="text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                          <Button
                            onClick={() =>
                              router.push(
                                `/admin/list-membership/${encodeURIComponent(items.id)}`,
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
              className="bg-opacity-50 fixed inset-0 z-50 bg-black/50"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 transition hover:text-gray-700"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  ✕
                </button>

                <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
                  Tambah Produk
                </h2>

                <form
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  onSubmit={handleSubmit}
                >
                  {(Object.keys(form) as (keyof FormFields)[]).map((key) => (
                    <div key={key} className="flex flex-col">
                      <label className="mb-1 text-sm font-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </label>
                      <input
                        name={key}
                        value={form[key].toString()}
                        onChange={handleChange}
                        className="rounded-lg border px-3 py-2"
                      />
                    </div>
                  ))}

                  <div className="flex flex-col">
                    <label
                      htmlFor="vehicle_type"
                      className="mb-1 text-sm font-medium text-gray-700"
                    >
                      Jenis Kendaraan
                    </label>
                    <select
                      name="vehicle_type"
                      value={form.vehicle_type}
                      onChange={handleChange}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="MOBIL">MOBIL</option>
                      <option value="MOTOR">MOTOR</option>
                    </select>
                  </div>

                  <div className="flex justify-end md:col-span-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "Menyimpan..." : "Simpan Produk"}
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
