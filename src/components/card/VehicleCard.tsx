"use client";

import CardVehicle from "@/components/card-vehicle/page";
import { useAuth } from "@/context/AuthContext";
import { CardHistoryProps, useVehicle } from "@/hooks/useVehicle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiSearch, FiX } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

const ITEMS_PER_PAGE = 5;

export default function VehicleCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);

  const { isAuthenticated, isLoadingAuth, userToken } = useAuth();
  const router = useRouter();

  const {
    data: dataVehicle,
    isLoading,
    isError,
    refetch,
  } = useVehicle(
    isAuthenticated,
    userToken!,
    currentPage,
    ITEMS_PER_PAGE,
    debouncedSearchText,
  );

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      router.push("/");
      return;
    }

    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, isLoadingAuth, router, refetch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText]);

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
    setCurrentPage(1);
  };

  if (isError) {
    return (
      <div className="py-10">
        <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-red-500">
            Gagal memuat data kendaraan
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const pageData: CardHistoryProps[] = dataVehicle?.data || [];

  const totalCount = dataVehicle?.total || 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  return (
    <div className="w-full pt-4">
      {/* Header section */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Kendaraan Saya
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {totalCount > 0
                ? `${totalCount} kendaraan terdaftar`
                : "Kelola kendaraan membership kamu"}
            </p>
          </div>

          {/* {totalCount > 0 && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 text-slate-900">
              <FiPlus size={18} />
            </div>
          )} */}
        </div>
      </div>

      {/* Search */}
      {totalCount > 0 && (
        <div className="mb-4">
          <div className="relative">
            <FiSearch
              size={18}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari nomor plat..."
              value={searchText}
              onChange={handleSearchTextChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-10 text-sm text-slate-700 transition outline-none placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            />

            {searchText && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-slate-700"
                aria-label="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 w-full animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="mt-4 h-7 w-40 rounded bg-slate-100" />
              <div className="mt-3 h-3 w-24 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : pageData.length > 0 ? (
        <>
          {/* Vehicle cards */}
          <div className="space-y-3">
            {pageData.map((item: CardHistoryProps, index: number) => (
              <CardVehicle
                key={
                  item.rfid ||
                  item.plate_number ||
                  item.member_customer_no ||
                  index
                }
                idcustomer={item.member_customer_no}
                date={item.createdAt}
                type={item.vehicle_type}
                plateNumber={item.plate_number}
                rfidNo={item.rfid}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                <FaArrowLeft size={13} />
              </button>

              <div className="text-center">
                <p className="text-xs font-semibold text-slate-700">
                  Halaman {currentPage} dari {totalPages}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {totalCount} kendaraan
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                <FaArrowRight size={13} />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
            <Image
              src="/images/company/vehicles.png"
              alt="Kendaraan"
              width={120}
              height={120}
              className="h-20 w-20 object-contain opacity-60"
            />
          </div>

          <h3 className="mt-5 text-base font-bold text-slate-800">
            {searchText ? "Kendaraan Tidak Ditemukan" : "Belum Ada Kendaraan"}
          </h3>

          <p className="mt-1 max-w-xs text-sm leading-5 text-slate-400">
            {searchText
              ? `Tidak ada kendaraan yang cocok dengan "${searchText}".`
              : "Tambahkan kendaraan untuk mulai menggunakan membership kamu."}
          </p>

          {searchText && (
            <button
              type="button"
              onClick={clearSearch}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Hapus Pencarian
            </button>
          )}
        </div>
      )}

      {/* Loading overlay saat request berjalan */}
      {isLoading && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-slate-900/10">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
            <ClipLoader size={20} color="#facc15" />

            <span className="text-sm font-medium text-slate-600">
              Memuat kendaraan...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
