import VehicleCard from "@/components/card/VehicleCard";
import HeaderPage from "@/components/header-page/page";
import VehicleAdd from "@/components/modal/VehicleAdd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Vehicle() {
  return (
    <div className="min-h-screen w-full bg-white">
      <HeaderPage title="Vehicle" />

      <main className="mx-auto w-full max-w-xl px-4 pb-24">
        <VehicleCard />
      </main>

      <VehicleAdd />
    </div>
  );
}
