import { Metadata } from "next";
import React from "react";
import VehicleCard from "@/components/card/VehicleCard";
import VehicleAdd from "@/components/modal/VehicleAdd";
import HeaderPage from "@/components/header-page/page";

export const metadata: Metadata = {
  title: "Vehicle | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Vehicle() {
  return (
    <div className="relative min-h-screen w-full bg-white">
      {/* Header tetap di atas */}
      <HeaderPage title="Vehicle" />

      {/* Konten Card yang scrollable */}
      <div className="flex-1 overflow-y-auto">
        {" "}
        {/* Add padding-top for header space */}
        <VehicleCard />
      </div>

      {/* Button di pojok kanan bawah */}
      <VehicleAdd />
    </div>
  );
}
