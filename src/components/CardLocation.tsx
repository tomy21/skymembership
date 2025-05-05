"use client"

import React, { useMemo, useState } from 'react'
import { BiMapPin } from 'react-icons/bi';

const dummyLokasi = [
  { id: 1, nama: "Yoga Center - Jakarta Selatan", alamat: "Jl. Kemang Raya No.12, Jakarta Selatan", status: "Aktif" },
  { id: 2, nama: "Wellness Hub - Bandung", alamat: "Jl. Dago Atas No.8, Bandung", status: "Aktif" },
  { id: 3, nama: "Zen Space - Surabaya", alamat: "Jl. Dharmawangsa No.17, Surabaya", status: "Nonaktif" },
  { id: 4, nama: "Bali Yoga Studio", alamat: "Jl. Pantai Batu Bolong No.88, Bali", status: "Aktif" },
  { id: 5, nama: "Sky Fitness - Jakarta Utara", alamat: "Jl. Pluit Selatan No.5", status: "Aktif" },
  { id: 6, nama: "Mindful Space - Yogyakarta", alamat: "Jl. Kaliurang KM 10", status: "Nonaktif" },
  { id: 7, nama: "Jakarta Wellness Club", alamat: "Jl. Sudirman Kav. 7", status: "Aktif" },
  { id: 8, nama: "Bandung Yoga Loft", alamat: "Jl. Braga No.10", status: "Aktif" },
  { id: 9, nama: "Zen Garden Bali", alamat: "Jl. Petitenget No.100", status: "Aktif" },
  { id: 10, nama: "Surabaya Soul Studio", alamat: "Jl. Mayjen Sungkono No.21", status: "Nonaktif" },
];

const itemsPerPage = 6;

export default function CardLocation() {
    const [searchTerm, setSearchTerm] = useState("");
      const [page, setPage] = useState(1);
    
      const filteredLokasi = useMemo(() => {
        return dummyLokasi.filter((lokasi) =>
          `${lokasi.nama} ${lokasi.alamat}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }, [searchTerm]);
    
      const totalPages = Math.ceil(filteredLokasi.length / itemsPerPage);
      const currentData = filteredLokasi.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  return (
    <>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <input
            type="text"
            placeholder="Cari lokasi..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {currentData.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-12">Data lokasi tidak ditemukan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentData.map((lokasi) => (
              <div
                key={lokasi.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">{lokasi.nama}</h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      lokasi.status === "Aktif"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {lokasi.status}
                  </span>
                </div>
                <div className="flex items-start text-sm text-gray-600 mt-2 space-x-2">
                  <BiMapPin size={16} className="text-emerald-500 mt-0.5" />
                  <p>{lokasi.alamat}</p>
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
    </>
  )
}
