// CardHistoryList.tsx

import React, { useState } from "react";
import { CardHistoryProps } from "@/hooks/useVehicle";
import CardHistory from "@/app/(admin)/(customer)/(ui-elements)/card-history/Page";

type CardHistoryListProps = {
  data: CardHistoryProps[];
  itemsPerPage?: number;
};

export default function CardHistoryList({
  data,
  itemsPerPage = 5,
}: CardHistoryListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-4">
      {/* Card List */}
      {paginatedData.map((item, index) => (
        <CardHistory key={index} {...item} />
      ))}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`rounded px-3 py-1 ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
