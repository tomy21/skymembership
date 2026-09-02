import { ReactNode } from "react";

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode; // Optional: kalau kamu mau kasih ikon per card
  bgColor?: string; // Optional: untuk custom warna background
}

export default function DashboardCard({
  label,
  value,
  icon,
  bgColor,
}: DashboardCardProps) {
  return (
    <div
      className={`h-40 rounded-xl p-5 text-white shadow-md transition-transform duration-200 hover:scale-[1.02] ${
        bgColor || "bg-gradient-to-br from-blue-500 to-indigo-600"
      }`}
    >
      <div className="flex w-full items-center justify-between">
        {icon && <div className="text-3xl">{icon}</div>}
        <div className="rounded-md border border-gray-300 p-2 text-xs">
          View all
        </div>
      </div>
      <div className="mt-5 mb-2 text-sm">{label}</div>
      <div className="text-3xl font-medium">{value}</div>
    </div>
  );
}
