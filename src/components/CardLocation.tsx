"use client";

import { useAllLocation } from "@/hooks/useLocation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiMapPin, BiSearch } from "react-icons/bi";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";

interface Location {
  id: number;
  location_name: string;
  address: string;
}

const itemsPerPage = 6;

export default function CardLocation() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  const lokasiData = useAllLocation(page, itemsPerPage, searchTerm);

  const currentData: Location[] = lokasiData?.data?.data || [];

  const totalCount = lokasiData?.data?.total || 0;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f8fa]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-amber-300">
        <div className="mx-auto flex h-16 w-full max-w-xl items-center px-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
            aria-label="Kembali"
          >
            <FiArrowLeft size={19} />
          </button>

          <h1 className="flex-1 text-center text-lg font-bold text-slate-900">
            Lokasi
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-xl px-4 pb-10">
        {/* Search */}
        <section className="pt-5">
          <div className="relative">
            <BiSearch
              size={20}
              className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari lokasi..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-11 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Hapus pencarian"
              >
                <FiX size={15} />
              </button>
            )}
          </div>
        </section>

        {/* Result info */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Lokasi Parkir
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {searchTerm
                ? `${currentData.length} lokasi ditemukan`
                : `${totalCount} lokasi tersedia`}
            </p>
          </div>
        </div>

        {/* Loading */}
        {lokasiData.isLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="h-4 w-2/5 rounded bg-slate-200" />

                <div className="mt-3 h-3 w-4/5 rounded bg-slate-100" />

                <div className="mt-2 h-3 w-3/5 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : currentData.length === 0 ? (
          /* Empty */
          <div className="mt-4 flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
              <BiMapPin size={34} className="text-slate-300" />
            </div>

            <h2 className="mt-4 text-base font-bold text-slate-800">
              Lokasi tidak ditemukan
            </h2>

            <p className="mt-1 max-w-xs text-sm leading-5 text-slate-400">
              {searchTerm
                ? "Tidak ada lokasi yang sesuai dengan pencarian Anda."
                : "Belum tersedia data lokasi parkir."}
            </p>

            {searchTerm && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-yellow-600 transition hover:bg-yellow-50"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          /* Location List */
          <section className="mt-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {currentData.map((lokasi) => (
                <div
                  key={lokasi.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-yellow-300 hover:shadow-sm"
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600 transition group-hover:bg-yellow-100">
                      <BiMapPin size={21} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900">
                        {lokasi.location_name}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        {lokasi.address || "Alamat tidak tersedia"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pagination */}
        {!lokasiData.isLoading && totalPages > 1 && (
          <section className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman sebelumnya"
            >
              <FiArrowLeft size={15} />
            </button>

            <div className="text-center">
              <p className="text-xs text-slate-400">Halaman</p>

              <p className="text-sm font-bold text-slate-800">
                {page}
                <span className="font-normal text-slate-400">
                  {" "}
                  / {totalPages}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman berikutnya"
            >
              <FiArrowRight size={15} />
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
