import React from "react";
import { cn } from "../../../../../../libs/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
// opsional jika pakai clsx atau cn helper

type CardHistoryProps = {
  type: "payment" | "parking";
  date: string;
  product: string;
  location: string;
  productName: string;
  amount: number;
  status: "paid" | "failed" | "pending" | "masuk" | "keluar";
  isMember?: boolean;
  onClick?: () => void;
};

export default function CardHistory({
  type,
  date,
  product,
  location,
  productName,
  amount,
  status,
  isMember,
  onClick,
}: CardHistoryProps) {
  const statusColorMap: Record<string, string> = {
    paid: "text-green-600 bg-green-100",
    failed: "text-red-600 bg-red-100",
    pending: "text-yellow-600 bg-yellow-100",
    masuk: "text-green-600 bg-green-100",
    keluar: "text-red-600 bg-red-100",
  };

  const statusLabelMap: Record<string, string> = {
    paid: "Paid",
    failed: "Failed",
    pending: "Pending",
    masuk: "Masuk Area",
    keluar: "Keluar Area",
  };

  return (
    <div
      onClick={onClick}
      className="relative w-full space-y-3 rounded-xl border border-gray-300 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="absolute top-14 left-0 w-full border border-dashed border-slate-300"></div>
      <div className="absolute bottom-10 left-0 w-full border border-dashed border-slate-300"></div>
      <div className="absolute top-10 -left-4 h-8 w-8 rounded-full border-r border-slate-300 bg-white"></div>
      <div className="absolute top-10 -right-4 h-8 w-8 rounded-full border-l border-slate-300 bg-white"></div>
      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <span className="text-xs text-gray-500">
          {format(new Date(date), "dd MMMM yyyy, HH:mm", {
            locale: id,
          })}
        </span>
        <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 capitalize">
          {product}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-1 py-3">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {location}
        </p>
        <div className="flex w-full items-center justify-between">
          <p className="text-base font-semibold text-gray-800 dark:text-white">
            {productName}
          </p>
          <p className="text-md font-bold text-emerald-600 dark:text-emerald-400">
            {amount.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between space-y-2">
        <span
          className={cn(
            "rounded px-2 py-1 text-xs font-semibold",
            statusColorMap[status],
          )}
        >
          {statusLabelMap[status]}
        </span>
        {type === "parking" && (
          <span
            className={cn(
              "rounded-full border px-2 py-1 text-xs",
              isMember
                ? "border-green-400 bg-green-100 text-green-700"
                : "border-gray-300 bg-gray-100 text-gray-600",
            )}
          >
            {isMember ? "Member" : "Non Member"}
          </span>
        )}
      </div>
    </div>
  );
}
