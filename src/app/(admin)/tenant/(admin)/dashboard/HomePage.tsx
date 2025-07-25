"use client";
import { FaMoneyBillWave, FaShoppingCart, FaUsers } from "react-icons/fa";
import DashboardCard from "../../components/DashboardCard";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import OrderModal from "../../components/OrderContent"; // ini file modalnya
import TableBillingPayment from "./TableBillingPayment";

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

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center space-y-7">
        <div className="flex w-full items-center justify-between">
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

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-4">
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

        <div className="flex w-full flex-row items-start justify-between space-x-5">
          <TableBillingPayment />
        </div>
      </div>

      {/* Modal Slide Order */}
      {modalOrder && <OrderModal onClose={() => setModalOrder(false)} />}
    </>
  );
}
