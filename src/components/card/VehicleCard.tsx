"use client";

import React, { useState, useEffect } from "react";
import CardVehicle from "@/components/card-vehicle/page";
import { useVehicle, CardHistoryProps } from "@/hooks/useVehicle";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useDebounce } from "use-debounce";

export default function VehicleCard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const { data: dataVehicle, isLoading, isError } = useVehicle(currentPage, itemsPerPage, debouncedSearchText);
  
  // recalc itemsPerPage on resize
  useEffect(() => {
    function updateCount() {
      const cardHeight = 160;
      const reserved = 240;
      const perPage = Math.max(1, Math.floor((window.innerHeight - reserved) / cardHeight));
      setItemsPerPage(perPage);
    }
    
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchText(e.target.value);
    setCurrentPage(1);
  };
  

  // Move error and loading checks out of early return to keep hooks on the same level
  if (isError) return <div>Error loading vehicles</div>;
  if (isLoading) return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
        <div className="flex flex-col items-center justify-center p-6">
          <ClipLoader size={50} color="#3b82f6" />
          <p className="mt-4 text-gray-700">Memproses...</p>
        </div>
    </div>
  );

  // const all = dataVehicle?.data || [];

  const pageData = dataVehicle?.data || [];
  const totalPages = Math.ceil((dataVehicle?.total || 0) / itemsPerPage);

  return (
    <div className="p-5 flex flex-col items-center space-y-4">
      {/* Search box */}
      <input
        type="text"
        placeholder="Search by plate number…"
        className="w-full max-w-md p-2 border rounded"
        value={searchText}
        onChange={handleSearchTextChange}
      />

      {/* cards */}
      <div className="w-full flex flex-col space-y-4">
        {pageData.map((item: CardHistoryProps, i: number) => (
          <CardVehicle
            key={i}
            idcustomer={item.member_customer_no}
            date={item.createdAt}
            type={item.vehicle_type}
            plateNumber={item.plate_number}
            rfidNo={item.rfid}
          />
        ))}
        {pageData.length === 0 && (
          <div className="text-center py-10 text-gray-500">No vehicles found.</div>
        )}
      </div>

      {/* pagination controls */}
      {itemsPerPage && (
        <div className="mt-6 flex items-center space-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <FaArrowLeft/>
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <FaArrowRight/>
          </button>
        </div>
      )}
    </div>
  );
}
