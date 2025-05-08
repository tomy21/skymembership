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
    const currentData = lokasiData && lokasiData.data?.data || [];
    const totalCount = lokasiData && lokasiData.data?.total || 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }


    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <input
            type="text"
            placeholder="Cari lokasi..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset ke halaman pertama saat search berubah
            }}
          />
        </div>

        {lokasiData.isLoading ? (
          <p className="text-center text-gray-500 text-sm mt-12">Memuat data lokasi...</p>
        ) : currentData.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-12">Data lokasi tidak ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentData.map((lokasi: Location) => (
              <div
                key={lokasi.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-800">{lokasi.location_name}</h2>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                  <BiMapPin className="text-emerald-500 mt-1 min-w-[16px] min-h-[16px]" size={16} />
                  <p className="leading-snug">{lokasi.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-10">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  }
