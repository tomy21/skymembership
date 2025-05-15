"use client";

import { useAllLocation } from "@/hooks/useLocation";
import React, { useEffect, useState } from "react";
import { BiMapPin } from "react-icons/bi";

interface Location {
  id: number;
  location_name: string;
  address: string;
}

const itemsPerPage = 6;

export default function CardLocation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  const lokasiData = useAllLocation(page, itemsPerPage, searchTerm);
  const currentData = (lokasiData && lokasiData.data?.data) || [];
  const totalCount = (lokasiData && lokasiData.data?.total) || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Cari lokasi..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none md:w-72"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // Reset ke halaman pertama saat search berubah
          }}
        />
      </div>

      {lokasiData.isLoading ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          Memuat data lokasi...
        </p>
      ) : currentData.length === 0 ? (
        <p className="mt-12 text-center text-sm text-gray-500">
          Data lokasi tidak ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {currentData.map((lokasi: Location) => (
            <div
              key={lokasi.id}
              className="space-y-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800">
                  {lokasi.location_name}
                </h2>
              </div>
              <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                <BiMapPin
                  className="mt-1 min-h-[16px] min-w-[16px] text-emerald-500"
                  size={16}
                />
                <p className="leading-snug">{lokasi.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
