"use client";
import { FaMoneyBillWave, FaShoppingCart, FaUsers } from "react-icons/fa";
import DashboardCard from "../components/DashboardCard";
import ParkingTable from "../components/ParkingTable";
import TableBillingPayment from "./TableBillingPayment";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import OrderModal from "../components/OrderContent"; // ini file modalnya

export default function HomePage() {
  const [modalOrder, setModalOrder] = useState(false);

  const stats = [
    {
      label: "Total Membership",
      value: 12,
      icon: <FaUsers />,
      bgColor: "bg-gradient-to-br from-pink-500 to-rose-500",
    },
    {
      label: "Total Order",
      value: 25,
      icon: <FaShoppingCart />,
      bgColor: "bg-gradient-to-br from-cyan-500 to-blue-500",
    },
    {
      label: "Total Order",
      value: 25,
      icon: <FaShoppingCart />,
      bgColor: "bg-gradient-to-br from-cyan-500 to-blue-500",
    },
    {
      label: "Total Value",
      value: "Rp 5.000.000",
      icon: <FaMoneyBillWave />,
      bgColor: "bg-gradient-to-br from-green-400 to-emerald-600",
    },
  ];

  const historyOrders = [
    {
      Plate: "B 1111 CCC",
      Start: "2025-06-25 07:00",
      End: "09:00",
      Value: "Rp 10.000",
    },
    {
      Plate: "D 2222 DDD",
      Start: "2025-06-24 06:00",
      End: "07:30",
      Value: "Rp 7.500",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <main className="space-y-6 p-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Hi, Welcome jhon doe
            </h1>
            <Button
              onClick={() => setModalOrder(true)}
              variant="primary"
              size="sm"
            >
              Order
            </Button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <DashboardCard
                key={i}
                label={s.label}
                value={s.value}
                icon={s.icon}
                bgColor={s.bgColor}
              />
            ))}
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TableBillingPayment />
            <ParkingTable
              title="Riwayat Parking"
              columns={["Plate", "Start", "End", "Value"]}
              data={historyOrders}
            />
          </div>
        </main>
      </div>

      {/* Modal Slide Order */}
      {modalOrder && <OrderModal onClose={() => setModalOrder(false)} />}
    </>
  );
}
